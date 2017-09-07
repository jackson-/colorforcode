// const stripe = require('stripe')('API_SECRET')
const nodemailer = require('nodemailer')
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2')
const db = require('APP/db')
const {Job, Employer, Skill} = db
const Promise = require('bluebird')

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    let jobs = []
    Job.findAll({include: [Skill]})
      .then(result => {
        jobs = result
        return Skill.findAll()
      })
      .then(skills => res.status(200).json({jobs, skills}))
  })

  // search bar raw query
  .post('/search', (req, res, next) => {
    let {query} = req.body
    const options = {
      model: db.Job,
      hasJoin: true
    }
    let q = query.split(' ').join(' & ')
    const sql = (
      'SELECT * FROM (' +
        'SELECT DISTINCT ' +
          'ON(id) * ' +
          'FROM (' +
            'SELECT job.*, ' +
              '(' +
                'SELECT array_agg(row_to_json(skill.*)) ' +
                'FROM skill ' +
                'LEFT JOIN jobskill ON jobskill.skill_id = skill.id ' +
                'WHERE jobskill.job_id = job.id ' +
              ') ' +
            'AS skills, ' +
             "setweight(to_tsvector(job.title), 'A') || " +
             "setweight(to_tsvector(job.description), 'B') || " +
             "setweight(to_tsvector('simple', skill.title), 'A') || " +
             "setweight(to_tsvector('simple', coalesce(string_agg(skill.title, ' '))), 'B') " +
            'AS document ' +
            'FROM job ' +
            'JOIN jobskill ON jobskill.job_id = job.id ' +
            'INNER JOIN skill ON skill.id = jobskill.skill_id ' +
            'GROUP BY job.id, skill.id' +
          ') p_search ' +
          `WHERE p_search.document @@ to_tsquery('english', '${q}') ` +
          'ORDER BY id ASC, ' +
          `ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC` +
      ') jobs ' +
      'ORDER BY updated_at DESC;'
    )
    db.query(sql, options)
      .then(jobs => {
        return Skill.findAll()
          .then(skills => {
            return res.status(200).json(jobs)
          })
      })
      .catch(next)
  })

  // advanced search raw query
  .post('/search/advanced', (req, res, next) => {
    // Account for coords
    let {coords, distance, terms, employment_types, sortBy} = req.body
    let within = ''
    const q = terms.length
      ? (terms.length > 1 ? terms.join(' & ') : terms[0])
      : ''
    const setWeight = q
      ? (
        ", setweight(to_tsvector(job.title), 'A') || " +
        "setweight(to_tsvector(job.description), 'B') || " +
        "setweight(to_tsvector('simple', skill.title), 'A') || " +
        "setweight(to_tsvector('simple', coalesce(string_agg(skill.title, ' '))), 'B') " +
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
      : '' // ^ this compares the job's employment_types with the user selected employment_types
    if (coords) {
      // here we get the geometry of the coords generated by the user input zip code
      coords = `ST_SetSRID(ST_MakePoint(${coords.lng}, ${coords.lat}), 32661)`
      // then we redefine 'within' as the result of a PostGIS SQL function
      within = `ST_DWithin(coords, ${coords}, ${distance * 0.016}) `
      // ^ 0.016deg = the spatial reference unit of WGS 84 && =~ 1mi
      // be sure to create an index for this geometry for fast search results:
      // CREATE INDEX job_coords_idx ON job USING GIST (coords);
    }
    const distanceMiles = within
      ? `, (ST_Distance(coords, ${coords}) / 0.016) AS distance_miles`
      : ''
    const andORwhere = employment_types.length
      ? (within ? 'AND ' : '')
      : (within ? 'WHERE ' : '')
    const orderBy = sortBy && sortBy === 'distance'
      ? `ORDER BY updated_at DESC, ST_Distance(coords, ${coords}) ASC;`
      : 'ORDER BY updated_at DESC;'
    const sql = (
      `SELECT *${distanceMiles} FROM (` +
        'SELECT DISTINCT ' +
          'ON(id) * ' +
          'FROM (' +
            'SELECT job.*, ' +
              '(' +
                'SELECT array_agg(row_to_json(skill.*)) ' +
                'FROM skill ' +
                'LEFT JOIN jobskill ON jobskill.skill_id = skill.id ' +
                'WHERE jobskill.job_id = job.id ' +
              ') ' +
            'AS skills' +
             setWeight +
            'FROM job ' +
            'JOIN jobskill ON jobskill.job_id = job.id ' +
            'INNER JOIN skill ON skill.id = jobskill.skill_id ' +
            'GROUP BY job.id, skill.id' +
          ') p_search ' +
          tsVectorQuery +
          'ORDER BY id ASC' +
          orderByTSVectorQueryRank +
      ') jobs ' +
      employmentTypes + andORwhere + within + orderBy
    )
    const options = {
      model: Job,
      hasJoin: true
    }
    db.query(sql, options)
      .then(jobs => {
        console.log('NUM JOBS MATCHED: ', jobs.length)
        res.status(200).json(jobs)
      })
      .catch(err => {
        console.log('EMPLOYMENT TYPES: ', employment_types, 'FAILED QUERY: ', sql)
        return next(err)
      })
  })

  .post('/', (req, res, next) => {
    // Extract out payment route
    const {jobs, skills} = req.body
    console.log('JOBS', jobs, 'SKILLS', skills)
    let amount = 0
    if (jobs.length >= 5) {
      amount = jobs.length * 225 * 100
    } else if (jobs.length >= 2 && jobs.length <= 4) {
      amount = jobs.length * 270 * 100
    } else if (jobs.length === 1) {
      amount = 300 * 100
    } else {
      return next(new Error({
        message: 'No jobs were sent to server. Please refill form.',
        status: 500
      }))
    }
    console.log('AMOUNT', amount)
    const token = req.body.token
    stripe.charges.create({
      amount,
      currency: 'usd',
      // source: token, // obtained with Stripe.js
      source: 'tok_visa',
      description: 'Charge for job stuff'
    }, (err, charge) => {
      console.log('ERR', err, 'CHARGE', charge)
    })
      .then(() => {
        return Promise.map(jobs, (job, i) => {
          return Job.create(job)
            .then((created) => {
              console.log('CREATE', created, 'I', typeof skills[i])
              return created.addSkills(skills[i])
            })
        })
      })
      .then(() => res.status(200).json({message: 'Jobs succesfully created!'}))
      .catch(err => next(err))
  })

  .get('/:id',
    (req, res, next) => {
      let job
      Job.findOne({
        where: {
          id: req.params.id
        },
        include: [Employer, Skill]
      })
        .then(foundJob => {
          job = foundJob
          return Skill.findAll()
        })
        .then(skills => res.json({job, skills}))
        .catch(next)
    })

  .put('/:id',
    (req, res, next) => {
      const {job, skills} = req.body
      Job.update(job, {
        where: {id: req.params.id},
        returning: true
      })
        .spread((numJobsUpdated, updatedJobsArr) => {
          const updatedJob = updatedJobsArr[0]
          return updatedJob.addSkills(skills)
        })
        .then(() => res.sendStatus(200))
        .catch(next)
    })

  .delete('/:id',
    (req, res, next) => {
      // we 'close' the job in Postgres but we delete the job from Elasticsearch,
      // that way the job won't show up in job searches but the job data still
      // can be seen and managed in the employer's (recruiter(s)) dashboard
      Job.update({status: 'closed'}, {
        where: {id: req.params.id},
        returning: true
      })
        .spread((numClosedJobs, closedJobsArr) => res.sendStatus(204))
        .catch(next)
    })

  .post('/:id/apply',
    (req, res, next) => {
      const {user} = req.body
      Job.findById(req.params.id)
        .then(foundJob => {
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'jackson.t.devin@gmail.com',
              pass: '3rdEyeFly6733'
            }
          })
          var mailOptions = {
            from: 'jackson.t.devin@gmail.com',
            to: `${foundJob.application_email}, ${foundJob.cc_email}`,
            subject: 'New Applications!',
            html: `<p>${user.first_name} ${user.last_name} just applied to ${foundJob.title}!
            Check them out <a href='http://localhost:3000/users/${user.id}'>here</a>.</p>`
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
          return foundJob.addApplicant(user.id)
        })
        .then(application => res.sendStatus(201))
        .catch(next)
    })
