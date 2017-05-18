'use strict'

const db = require('APP/db')
const {Employer} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) =>
      Employer.findAll()
      .then(employers => res.json(employers))
      .catch(next))
  .post('/', (req, res, next) =>
      Employer.create(req.body)
      .then(employer => res.status(201).json(employer))
      .catch(next))
  .get('/:id', (req, res, next) =>
      Employer.findById(req.params.id)
      .then(user => res.json(employer))
      .catch(next))
