'use strict'

const db = require('APP/db')
const {Skill, Employer} = db

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Skill.findAll()
    .then(skills => res.json(skills))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    const user = req.body.user
    const skill = req.body.skill
    Skill.create(skill)
    .then(createdSkill => {
    })
    .then(updatedListings => res.sendStatus(201))
    .catch(next)
  })
  .get('/:id',
    (req, res, next) =>
      Skill.findById(req.params.id, { include: [{ model: Employer}] })
      .then(skill => {
        return res.json(skill)
      })
      .catch(next))
