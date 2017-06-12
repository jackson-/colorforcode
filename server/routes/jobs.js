'use strict'

var stripe = require("stripe")(
  "API_SECRET"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Job, Employer, Skill} = db
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    const query = req.query ? req.query : {match_all: {}}
    let body = {
      query,
      from: 0
    }
    esClient.search({body, index: 'data'})
    .then(results => res.status(200).json(results.hits.hits))
    .catch(next)
  })

  .post('/', (req, res, next) => {
    const {skills} = req.body
    // const  token = req.body.token
    // stripe.charges.create({
    //   amount: 2,
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Charge for job stuff"
    // }, function(err, charge) {
    //   console.log("ERR", err, "CHARGE", charge)
    // });
    Job.create(req.body.job)
    .then(createdJob => createdJob.addSkills(skills))
    .then(jobskill => Job.findOne({
      where: {
        id: jobskill[0][0].get().job_id
      },
      include: [Skill, Employer]
    }))
    .then(job => esClient.create({
      index: 'data',
      type: 'job',
      id: `${job.id}`,
      body: job.get()
    }))
    .then(() => res.sendStatus(201))
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
      Job.findById(req.params.id)
      .then(foundJob => foundJob.update(job))
      .then(updatedJob => updatedJob.addSkills(skills))
      .then(() => Job.findOne({
        where: {
          id: req.params.id
        },
        include: [Skill, Employer]
      }))
      .then(editedJob => esClient.update({
        index: 'data',
        type: 'job',
        id: req.params.id,
        body: {
          doc: editedJob.get()
        }
      }))
      .then(() => res.sendStatus(200))
      .catch(next)
    })

  .delete('/:id',
    (req, res, next) => {
      Job.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(deletedJob => esClient.delete({
        index: 'data',
        type: 'job',
        id: req.params.id
      }))
      .then(() => res.sendStatus(204))
      .catch(next)
    })

  .post('/:id/apply',
    (req, res, next) => {
      const user_id = req.body.user_id
      Job.findById(req.params.id)
      .then(foundJob => foundJob.addApplicant(user_id))
      .then(application => res.sendStatus(201))
      .catch(next)
    })

  .get('/employer/:id',
    (req, res, next) => {
      Job.findAll({
        where:{
          employer_id: req.params.id
        },
        include: [Employer, Skill]
      })
      .then(jobs => res.json(jobs))
      .catch(next)
    })
