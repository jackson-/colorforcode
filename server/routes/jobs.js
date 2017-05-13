'use strict'

var stripe = require("stripe")(
  "sk_live_4QAwCdzRC5yNgAeR9ZOKTdbE"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Job, Employer} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Job.findAll()
    .then(jobs => res.json(jobs))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    const {name, email} = req.body.employer
    const job = req.body.job
    const token = req.body.token
    console.log("TOKEN", token)
    // stripe.charges.create({
    //   api_key: "sk_live_4QAwCdzRC5yNgAeR9ZOKTdbE",
    //   amount: 200, //this is in cents
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Test charge"
    // }, {
    //   idempotency_key: "ibpRKpx6b5P5WbIf"
    // }, function(err, charge) {
    //   console.log("ERR", err);
    //   console.log("CHARGE", charge);
    // });
    stripe.charges.create({
      amount: 2,
      currency: "usd",
      source: token, // obtained with Stripe.js
      description: "Charge for job stuff"
    }, function(err, charge) {
      console.log("ERR", err, "CAHRGE", charge)
    });
    console.log("DONE")
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
      Job.findById(req.params.id, { include: [{ model: Employer}] })
      .then(job => {
        return res.json(job)
      })
      .catch(next))
