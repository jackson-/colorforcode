'use strict'

var stripe = require("stripe")(
  "API_SECRET"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Job, Employer, Skill, JobSkillRelationship, JobApplication} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Job.findAll({ include: [{ model: Employer}, { model: Skill}] })
    .then(jobs => res.json(jobs))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    const {id} = req.body.employer
    const job = req.body.job
    // const  token = req.body.token
    // stripe.charges.create({
    //   amount: 2,
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Charge for job stuff"
    // }, function(err, charge) {
    //   console.log("ERR", err, "CAHRGE", charge)
    // });
    Job.create(
      job)
    .then(createdJob => {
      job.skills.forEach((skill) => {
        JobSkillRelationship.create({skill_id:skill, job_id:createdJob.id})
      })
      return Employer.findOrCreate({
        where: {id}
      })
      .spread((employer, created) => employer.addListings([createdJob]))
    })
    .then(updatedListings => res.sendStatus(201))
    .catch(next)
  })
  .post('/update', (req, res, next) => {
    const job = req.body.job
    Job.create(
      job)
    .then(createdJob => {
      job.skills.forEach((skill) => {
        JobSkillRelationship.findOrCreate({skill_id:skill, job_id:createdJob.id})
      })
      return res.sendStatus(201)
    })
    .catch(next)
  })
  .post('/apply', (req, res, next) => {
    const user_id = req.body.user_id
    const job_id = req.body.job_id
    JobApplication.create(
        {application_id:user_id,
        job_id}
      )
    .then(application => res.sendStatus(201))
    .catch(next)
  })
  .get('/:id',
    (req, res, next) =>
      Job.findById(req.params.id, { include: [{ model: Employer}, { model: Skill}] })
      .then(job => res.json(job))
      .catch(next))
  .get('/employer/:id',
    (req, res, next) => {
      console.log("ID", req.params.id)
      Job.findAll({ where:{employer_id:req.params.id},include: [{ model: Employer}, { model: Skill}] })
      .then(jobs => res.json(jobs))
      .catch(next)
    })
