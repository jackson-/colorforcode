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
    Job.findAll()
    .then(jobs => res.json(jobs))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    const {name, email} = req.body.employer
    const job = req.body.job
    // const token = req.body.token
    // stripe.charges.create({
    //   amount: 2,
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Charge for job stuff"
    // }, function(err, charge) {
    //   console.log("ERR", err, "CAHRGE", charge)
    // });
    Job.create(job)
    .then(createdJob => {
      return Employer.findOrCreate({
        where: {name, email}
      })
      .spread((employer, created) => employer.addListings([createdJob]))
    })
    .then(updatedListings => res.sendStatus(201))
    .catch(next)
  })
  .get('/:id',
    (req, res, next) =>
      Job.findById(req.params.id, { include: [{ model: Employer}, { model: Skill}] })
      .then(job => res.json(job))
      .catch(next))
