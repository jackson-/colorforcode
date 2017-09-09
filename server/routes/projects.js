const _ = require('underscore')
const db = require('APP/db')
const {Project, Skill, User} = db

module.exports = require('express').Router()

  .post('/', (req, res, next) => {
    const {skills} = req.body
    const {user} = req.body.project
    req.body.project.user_id = user.id
    Project.create(req.body.project)
      .then(createdProject => createdProject.setUser(user.id))
      .then(createdProject => createdProject.addSkills(skills))
      .then((addedSkills) => res.sendStatus(201))
      .catch(next)
  })

  .get('/:id',
    (req, res, next) => {
      let project
      Project.findOne({
        where: {id: req.params.id},
        include: [User, Skill]
      })
        .then(foundProject => {
          project = foundProject
          return Skill.findAll()
        })
        .then(skills => res.json({skills, project}))
        .catch(next)
    })

  .put('/:id',
    (req, res, next) => {
      const {project, skills} = req.body
      Project.findById(req.params.id)
        .then(foundProject => foundProject.update(project))
        .then(updatedProject => {
          if (skills) return updatedProject.setSkills(skills)
          else return updatedProject
        })
        .then(() => res.sendStatus(200))
        .catch(next)
    })

  .delete('/:id',
    (req, res, next) => {
      Project.findById(req.params.id)
        .then(project => {
          return project.destroy()
        })
        .then(deletedProject => res.sendStatus(204))
        .catch(next)
    })
