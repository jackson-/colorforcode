const stripe = require('stripe')('API_SECRET')
const nodemailer = require('nodemailer')
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Job, Employer, Skill, User} = db
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    let body = {
      query: {match_all: {}},
      from: 0
    }
    esClient.search({body, index: 'data', type: 'job'})
    .then(results => {
      return res.status(200).json(results.hits.hits)
    })
    .catch(next)
  })

  // search bar
  .post('/search', (req, res, next) => {
    const query = req.body.query
      ? {multi_match: {query: req.body.query, fields: ['_all']}}
      : {match_all: {}}

    esClient.search({
      index: 'data',
      type: 'job',
      body: {
        query,
        from:req.body.from ? req.body.from : 0
      }
    })
    .then(results => res.status(200).json(results.hits.hits))
    .catch(next)
  })

  // advanced search
  .post('/search/advanced', (req, res, next) => {
    const {body} = req
    esClient.search({body, index: 'data', type: 'job'})
    .then(advancedResults => res.status(200).json(advancedResults.hits.hits))
    .catch(next)
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
    (req, res, next) =>
      Job.findOne({
        where: {
          id: req.params.id
        },
        include: [Employer, Skill]
      })
      .then(job => res.json(job))
      .catch(next))

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
