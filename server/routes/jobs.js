const stripe = require('stripe')('API_SECRET')
const nodemailer = require('nodemailer')
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const Sequelize = require('sequelize')
const db = require('APP/db')
const {Job, Employer, Skill, User} = db
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    let jobs = []
    Job.findAll({include:Skill}).then(result => {
      jobs = result
      Skill.findAll().then(skills => {
        return res.status(200).json({hits:jobs, total:jobs.length, skills})
      })
    })
  })

  // search bar
  .post('/search', (req, res, next) => {
    console.log("GETTING HERE")
    let jobs = []
    const {query, from} = req.body
    const size = 10
    const options = {
        model: db.Job,
        // include: [db.Skill],
        hasJoin:true,
    }
    // db.Model.$validateIncludedElements(options)
    const db_query = "SELECT DISTINCT ON(id) id, * "+
      "FROM (SELECT job.*, " +
        // `ST_Distance(job.the_geom, ST_MakePoint(${body.coords})::geography) as distance, ` +
         "(SELECT array_agg(row_to_json(skill.*)) FROM skill LEFT JOIN jobskill ON jobskill.skill_id=skill.id WHERE jobskill.job_id=job.id) AS skills, " +
         "setweight(to_tsvector(job.title), 'A') || " +
         "setweight(to_tsvector(job.description), 'B') || " +
         "setweight(to_tsvector('simple', skill.title), 'A') || " +
         "setweight(to_tsvector('simple', coalesce(string_agg(skill.title, ' '))), 'B') as document " +
      "FROM job " +
      "JOIN jobskill ON jobskill.job_id = job.id " +
      "INNER JOIN skill ON skill.id = jobskill.skill_id " +
      "GROUP BY job.id, skill.id) p_search " +
      `WHERE p_search.document @@ to_tsquery('english', '${query}') ` +
      `ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${query}')) DESC;`
    db.query( db_query,
      options).then((result) =>{
      jobs = result
      Skill.findAll().then(skills => {
        return res.status(200).json({hits:jobs, total:jobs.length, skills})
      })
    }).catch(next);
  })

  // advanced search
  .post('/search/advanced', (req, res, next) => {
    const {body} = req
    const offset = body.from
    const limit = body.size
    const tsquery = body.query
    console.log(body)
    // var query = tsquery.indexOf(' ') == -1 ? "to_tsquery('english','" + tsquery + "')" : "plainto_tsquery('english','" + tsquery + "')";
    // db.query("SELECT *, ST_Distance(the_geom, ST_MakePoint(40.6655101,-73.8918897)::geography) AS Distance, ts_rank_cd(vector," + query + ",1)" +
    // " AS rank FROM job WHERE vector @@ " + query +
    // " ORDER BY rank DESC, id DESC" +
    // `OFFSET ${offset}` +
    // `LIMIT ${limit}`,
    // { model: db.Post }).then((result) =>{
    //   console.log("REUSLT", result)
    //   return res.status(200).json({result:result[0]})
    // });
  })

  .post('/search/experiment', (req, res, next) => {
    const {body} = req
    const offset = body.from
    const limit = body.size
    // const tsquery = body.query
    console.log(body.query)
    const options = {
        model: db.Job,
        // include: [db.Skill],
        hasJoin:true,
    }
    // db.Model.$validateIncludedElements(options)
    const query = "SELECT * "+
      "FROM (SELECT job.*, job.id as id, " +
        `ST_Distance(job.the_geom, ST_MakePoint(${body.coords})::geography) as distance, ` +
         "job.title as title, " +
         "job.description as description, " +
         "(SELECT array_agg(skill.title) FROM skill LEFT JOIN jobskill ON jobskill.skill_id=skill.id WHERE jobskill.job_id=job.id) AS skills, " +
         "setweight(to_tsvector(job.title), 'A') || " +
         "setweight(to_tsvector(job.description), 'B') || " +
         "setweight(to_tsvector('simple', skill.title), 'A') || " +
         "setweight(to_tsvector('simple', coalesce(string_agg(skill.title, ' '))), 'B') as document " +
      "FROM job " +
      "JOIN jobskill ON jobskill.job_id = job.id " +
      "INNER JOIN skill ON skill.id = jobskill.skill_id " +
      "GROUP BY job.id, skill.id) p_search " +
      `WHERE p_search.document @@ to_tsquery('english', '${body.query}') ` +
      `ORDER BY ts_rank(p_search.document, to_tsquery('english', '${body.query}')) DESC, p_search.distance ASC;`
    console.log("QUERY", query)
    db.query( query,
      options).then((result) =>{
      return res.status(200).json({result:result})
    });
  })

  .post('/', (req, res, next) => {
    const {skills, job} = req.body
    // const  token = req.body.token
    // stripe.charges.create({
    //   amount: 2,
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Charge for job stuff"
    // }, function(err, charge) {
    //   console.log("ERR", err, "CHARGE", charge)
    // });
    let newJobId = null
    Job.create(job)
      .then(createdJob => {
        newJobId = createdJob.id
        return createdJob.addSkills(skills)
      })
      .then(jobskill => {
        return Job.findOne({
          where: {
            id: jobskill[0][0].get().job_id
          },
          include: [Skill, Employer]
        })
      })
      .then(job => esClient.create({
        index: 'data',
        type: 'job',
        id: `${job.id}`,
        body: job.get()
      }))
      .then(() => res.json(newJobId))
      .catch(next)
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
      .then(() => Job.findOne({
        where: {id: req.params.id},
        include: [Skill, Employer]
      }))
      .then(editedJob => esClient.update({
        index: 'data',
        type: 'job',
        id: req.params.id,
        body: {doc: editedJob.get()}
      }))
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
      .spread((numClosedJobs, closedJobsArr) => esClient.delete({
        index: 'data',
        type: 'job',
        id: req.params.id
      }))
      .then(() => res.sendStatus(204))
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
        });
        var mailOptions = {
          from: 'jackson.t.devin@gmail.com',
          to: `${foundJob.application_email}, ${foundJob.cc_email}`,
          subject: 'New Applications!',
          html: `<p>${user.first_name} ${user.last_name} just applied to ${foundJob.title}!
          Check them out <a href='http://localhost:3000/users/${user.id}'>here</a>.</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return foundJob.addApplicant(user.id)
      })
      .then(application => res.sendStatus(201))
      .catch(next)
    })

  .get('/apps/:id',
    (req, res, next) =>
      User.findOne({
        where: {
          id: req.params.id
        },
        include: [{ association: 'Job' }]
      })
      .then(jobs => res.json(jobs))
      .catch(next))

  .get('/employer/:id',
    (req, res, next) => {
      Job.findAll({
        where: {
          employer_id: req.params.id
        },
        include: [Employer, Skill]
      })
      .then(jobs => res.json(jobs))
      .catch(next)
    })
