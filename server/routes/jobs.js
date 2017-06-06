'use strict'

var stripe = require("stripe")(
  "API_SECRET"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Job, Employer, Skill} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Job.findAll({ include: [Employer, Skill] })
    .then(jobs => res.json(jobs))
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
    //   console.log("ERR", err, "CAHRGE", charge)
    // });
    Job.create(req.body.job)
    .then(createdJob => createdJob.addSkills(skills))
    .then(jobskill => Job.findOne({
      where: {
        id: jobskill[0][0].get().job_id
      },
      include: [Skill, Employer]
    }))
    .then(job => res.status(201).json(job))
    .catch(next)
  })
  .put('/:id', (req, res, next) => {
    const job = req.body.job
    Job.findById(req.params.id)
    .then(foundJob => foundJob.update(req.body, {include: [Skill]}))
    .then(updatedJob => res.json(updatedJob))
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
  .post('/:id/apply', (req, res, next) => {
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
