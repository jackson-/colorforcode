const db = require('APP/db')
const {User, Employer, Skill, Project} = db
// const tinify = require('tinify')
// tinify.key = 'lm8HbN3+BXgdBe9KvYLG3+KkS7SISwCHXcbW1ybx'

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    User.findAll({
      where: {is_employer: false, is_looking: true},
      include: [{
        model: Project,
        include: [Skill]
      }]
    })
      .then(result => res.status(200).json(result))
      .catch(next)
  })

  .post('/', (req, res, next) =>
    User.create(req.body)
      .then(user => {
        if (user.is_employer) {
          return Employer.findOrCreate({
            where: {
              name: req.body.company_name,
              company_site: req.body.company_site
            }
          })
            .spread((employer, created) => user.setEmployer(employer.id))
        } else {
          res.status(201).json(user)
        }
      })
      .then(user => res.status(201).json(user))
      .catch(next)
  )

  // search bar raw query
  .post('/search', (req, res, next) => {
    const {query} = req.body
    const options = {
      model: db.User,
      hasJoin: true
    }
    let q = query.split(' ').join(' | ')
    const sql = (
      'SELECT * FROM (' +
        'SELECT DISTINCT ON(id) * ' +
        'FROM (' +
          'SELECT "user".*, ' +
            '(' +
              'SELECT json_agg(' +
                `json_build_object('id', project.id, 'title', project.title, 'skills', ` +
                  '(SELECT array_agg(row_to_json(skill.*)) ' +
                    'FROM skill ' +
                    'LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
                    'WHERE "ProjectSkill".project_id=project.id' +
                  ')' +
                ')' +
              ') ' +
            'FROM project ' +
            'WHERE project.user_id="user".id' +
          ') ' +
          'AS projects, ' +
          '(' +
            'SELECT json_agg(' +
              `json_build_object('id', project.id, 'title', project.title, 'skills', ` +
                '(' +
                  'SELECT array_agg(row_to_json(skill.*)) ' +
                  'FROM skill ' +
                  'LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
                  'WHERE "ProjectSkill".project_id=project.id' +
                ')' +
              ')' +
            ') ' +
            'FROM project ' +
            'WHERE project.user_id="user".id' +
          ') ' +
          'AS projects, ' +
          '(' +
            `SELECT to_tsvector('english', string_agg(skill.title, ' ')) ` +
            'FROM skill JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
            'INNER JOIN project ON project.id = "ProjectSkill".project_id ' +
            'WHERE project.user_id = "user".id' +
          ') || ' +
          `to_tsvector('english', "user".title) || ` +
          `to_tsvector('english', "user".summary) || ` +
          `to_tsvector('english', project.title) ` +
          'AS document ' +
          'FROM "user" ' +
          'JOIN project ON project.user_id = "user".id ' +
          'INNER JOIN "ProjectSkill" ON "ProjectSkill".project_id = project.id ' +
          'INNER JOIN skill ON skill.id = "ProjectSkill".project_id ' +
          'GROUP BY "user".id, project.id, skill.id' +
        ') p_search ' +
          `WHERE p_search.document @@ to_tsquery('english', '${q}') ` +
          `ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC` +
      ') users ' +
      'ORDER BY updated_at DESC;'
    )

    db.query(sql, options)
      .then(result => {
        return res.status(200).json(result)
      }).catch(next)
  })

  // advanced search raw query
  .post('/search/advanced', (req, res, next) => {
    let {coords, distance, terms, employment_types, sortBy} = req.body
    let within = ''
    const q = terms && terms.length
      ? (terms.length > 1 ? terms.join(' | ') : terms[0])
      : ''
    const tsVectors = q
      ? (
        ', (' +
          `SELECT to_tsvector('english', string_agg(skill.title, ' ')) ` +
          'FROM skill JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
          'INNER JOIN project ON project.id = "ProjectSkill".project_id ' +
          'WHERE project.user_id = "user".id' +
        ') || ' +
        `to_tsvector('english', "user".title) || ` +
        `to_tsvector('english', "user".summary) || ` +
        `to_tsvector('english', project.title) ` +
        'AS document '
      )
      : ' '
    const tsVectorQuery = q
      ? `WHERE p_search.document @@ to_tsquery('english', '${q}') `
      : ''
    const orderByTSVectorQueryRank = q
      ? `, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC`
      : ''

    const employmentTypes = employment_types.length
      ? `WHERE employment_types @> '{${employment_types.join(', ')}}'::VARCHAR(255)[] `
      : '' // ^ this compares the user's employment_types with the user selected employment_types
    if (coords) {
      // here we get the geometry of the coords generated by the user input zip code
      coords = `ST_SetSRID(ST_MakePoint(${coords.lng}, ${coords.lat}), 32661)`
      // then we redefine 'within' as the result of a PostGIS SQL function
      within = `ST_DWithin(coords, ${coords}, ${distance * 0.016}) `
      // ^ 0.016deg = the spatial reference unit of WGS 84 && =~ 1mi
      // be sure to create an index for this geometry for fast search results:
      // CREATE INDEX user_coords_idx ON user USING GIST (coords);
    }
    const distanceMiles = within
      ? `, (ST_Distance(coords, ${coords}) / 0.016) AS distance_miles`
      : ''
    const andORwhere = employment_types.length
      ? (within ? 'AND ' : '')
      : (within ? 'WHERE ' : '')
    const projectCount = sortBy === 'projectCount'
      ? (`(SELECT COUNT (project.id) FROM project WHERE project.user_id = "user".id) AS project_count, `)
      : ''
    const orderBy = sortBy && sortBy === 'distance'
      ? `ORDER BY updated_at DESC, ST_Distance(coords, ${coords}) ASC;`
      : (
        sortBy === 'projectCount'
          ? 'ORDER BY updated_at DESC, project_count DESC;'
          : 'ORDER BY updated_at DESC;'
      )

    const sql = (
      `SELECT *${distanceMiles} FROM (` +
        'SELECT DISTINCT ON(id) * ' +
        'FROM (' +
          `SELECT "user".*, ${projectCount}` +
            '(' +
              'SELECT json_agg(' +
                `json_build_object('id', project.id, 'title', project.title, 'skills', ` +
                  '(SELECT array_agg(row_to_json(skill.*)) ' +
                    'FROM skill ' +
                    'LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
                    'WHERE "ProjectSkill".project_id=project.id' +
                  ')' +
                ')' +
              ') ' +
            'FROM project ' +
            'WHERE project.user_id="user".id' +
          ') ' +
          'AS projects, ' +
          '(' +
            'SELECT json_agg(' +
              `json_build_object('id', project.id, 'title', project.title, 'skills', ` +
                '(' +
                  'SELECT array_agg(row_to_json(skill.*)) ' +
                  'FROM skill ' +
                  'LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id ' +
                  'WHERE "ProjectSkill".project_id=project.id' +
                ')' +
              ')' +
            ') ' +
            'FROM project ' +
            'WHERE project.user_id="user".id' +
          ') ' +
          'AS projects' +
          tsVectors +
          'FROM "user" ' +
          'JOIN project ON project.user_id = "user".id ' +
          'INNER JOIN "ProjectSkill" ON "ProjectSkill".project_id = project.id ' +
          'INNER JOIN skill ON skill.id = "ProjectSkill".project_id ' +
          'GROUP BY "user".id, project.id, skill.id' +
        ') p_search ' +
        tsVectorQuery +
        'ORDER BY id ASC' +
        orderByTSVectorQueryRank +
      ') users ' +
      employmentTypes + andORwhere + within + orderBy
    )

    const options = {
      model: User,
      hasJoin: true
    }

    db.query(sql, options)
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => {
        return next(err)
      })
  })

  .get('/:id', (req, res, next) => {
    User.findById(req.params.id, {
      include: [{
        model: Project,
        include: [Skill]
      }]
    })
      .then((user) => {
        return res.status(200).json(user)
      })
      .catch(next)
  })

  .put('/:id', (req, res, next) => {
    const {user, savedJobsArr} = req.body
    User.findById(req.params.id)
      .then(foundUser => {
        // the same route is used to save jobs for users and to update users,
        // but these tasks are never simultaneous
        return savedJobsArr
          ? foundUser.setSavedJobs(savedJobsArr)
          : foundUser.update(user)
      })
      .then(() => {
        return User.findById(req.params.id, {
          include: [{model: Project, include: [Skill]}]
        })
      })
      .then(updatedUser => res.sendStatus(200))
      .catch(next)
  })
