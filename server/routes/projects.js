'use strict'

var stripe = require("stripe")(
  "API_SECRET"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Project, Skill, User} = db
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    const query = req.query ? req.query : {match_all: {}}
    let body = {
      query,
      from: 0
    }
    esClient.search({body, index: 'data', type:'project'})
    .then(results => res.status(200).json(results.hits.hits))
    .catch(next)
  })

  .post('/', (req, res, next) => {
    const {skills} = req.body
    const {user} = req.body.project
    // const  token = req.body.token
    // stripe.charges.create({
    //   amount: 2,
    //   currency: "usd",
    //   source: token, // obtained with Stripe.js
    //   description: "Charge for project stuff"
    // }, function(err, charge) {
    //   console.log("ERR", err, "CHARGE", charge)
    // });
    Project.create(req.body.project)
    .then(createdProject => {
      return Promise.all([
        createdProject.addUser(user.id),
        createdProject.addSkills(skills)
      ])
    })
    .spread((user, projectskill) => Project.findOne({
      where: {
        id: projectskill[0][0].get().project_id
      },
      include: [Skill, User]
    }))
    .then(project => esClient.create({
      index: 'data',
      type: 'project',
      id: `${project.id}`,
      body: project.get()
    }))
    .then(() => res.sendStatus(201))
    .catch(next)
  })

  .get('/:id',
    (req, res, next) =>
      Project.findOne({
        where: {
          id: req.params.id
        },
        include: [User, Skill]
      })
      .then(project => res.json(project))
      .catch(next))

  .put('/:id',
    (req, res, next) => {
      const {project, skills} = req.body
      Project.findById(req.params.id)
      .then(foundProject => foundProject.update(project))
      .then(updatedProject => updatedProject.addSkills(skills))
      .then(() => Project.findOne({
        where: {
          id: req.params.id
        },
        include: [Skill, User]
      }))
      .then(editedProject => esClient.update({
        index: 'data',
        type: 'project',
        id: req.params.id,
        body: {
          doc: editedProject.get()
        }
      }))
      .then(() => res.sendStatus(200))
      .catch(next)
    })

  .delete('/:id',
    (req, res, next) => {
      Project.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(deletedProject => esClient.delete({
        index: 'data',
        type: 'project',
        id: req.params.id
      }))
      .then(() => res.sendStatus(204))
      .catch(next)
    })
