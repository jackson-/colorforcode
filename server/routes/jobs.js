'use strict'

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
