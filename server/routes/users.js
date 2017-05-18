'use strict'

const db = require('APP/db')
const {User, Employer} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) =>
      User.findAll()
      .then(users => res.json(users))
      .catch(next))
  .post('/', (req, res, next) =>
      User.create(req.body)
      .then(user => {
        if (user.is_employer) {
          return Employer.findOne({
            where: {
              name: req.body.company_name
            }
          })
          .then(employer => user.setEmployer(employer.id))
        } else {
          res.status(201).json(user)
        }
      })
      .then(user => res.status(201).json(user))
      .catch(next))
  .get('/:id', (req, res, next) =>
      User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(next))
