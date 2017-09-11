const db = require('APP/db')
const {User, Employer, Skill, Project} = db
// const tinify = require('tinify')
// tinify.key = 'lm8HbN3+BXgdBe9KvYLG3+KkS7SISwCHXcbW1ybx'

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    User.findAll({
      where: {is_employer: false},
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
  .post('/search', (req, res, next) => {
    //
    // SELECT DISTINCT ON(id) id, * FROM (
    //   SELECT *,
    //   (SELECT array_agg(row_to_json(project.*)) FROM project WHERE project.job_id=job.id) AS projects,
    //    setweight(to_tsvector(user.title), 'A') || setweight(to_tsvector(user.summary), 'B') || setweight(to_tsvector('simple', coalesce(string_agg(project.title, ' '))), 'B') as document
    //  FROM "user" GROUP BY user.id) p_search WHERE p_search.document @@ to_tsquery('english', ' & react') ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', ' & react')) DESC;

    const {query} = req.body
    const options = {
      model: db.User,
      hasJoin: true
    }
    let q = 'data'
    const db_query = (
      'SELECT DISTINCT ON(id) id, * ' +
      'FROM (SELECT "user".*, ' +
      // `ST_Distance(job.the_geom, ST_MakePoint(${body.coords})::geography) as distance, ` +
         `(SELECT json_agg(json_build_object('title', project.title, 'skills', (SELECT array_agg(row_to_json(skill.*)) FROM skill LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id WHERE "ProjectSkill".project_id=project.id))) FROM project WHERE project.user_id="user".id) AS projects, ` +
         'to_tsvector("user".title) || ' +
         'to_tsvector("user".summary) || ' +
         'to_tsvector(project.title) as document ' +
      // 'to_tsvector("simple", coalesce(string_agg(project.title, " "))) as document ' +
      'FROM "user" ' +
      'JOIN project ON project.user_id = "user".id ' +
      'INNER JOIN "ProjectSkill" ON "ProjectSkill".project_id = project.id ' +
      'INNER JOIN skill ON skill.id = "ProjectSkill".project_id ' +
      'GROUP BY "user".id, project.id, skill.id) p_search ' +
      'WHERE ' +
      `p_search.document @@ to_tsquery('english', '${q}') ` +
      `ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC;`
    )
    console.log('QUERY ', db_query)
    db.query(db_query, options)
      .then(result => {
        console.log('RESULT', result)
        return res.status(200).json(result)
      }).catch(next)
  })

  // .post('/search/advanced', (req, res, next) => {
  //   const {body} = req
  //
  // })

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
