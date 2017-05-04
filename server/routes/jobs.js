'use strict'

const db = require('APP/db')
const {Job} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Job.findAll()
    .then(jobs => res.json(jobs))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    Job.create(req.body)
    .then(job => res.json(job))
    .catch(next)
  })
