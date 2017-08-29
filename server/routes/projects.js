'use strict'

var _ = require("underscore")
var stripe = require("stripe")(
  "API_SECRET"
);
// var stripe = require("stripe")(
//   "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
// );
const db = require('APP/db')
const {Project, Skill, User} = db
const aws = require('aws-sdk')
const S3_BUCKET = 'hireblack'
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    let query = req.query ? req.query : {match_all: {}}
    let body = {
      query,
      from: 0
    }
    esClient.search({body, index: 'data', type:'project'})
    .then(results => {
      return res.status(200).json(results.hits.hits)
    })

    .catch(next)
  })

  .post('/', (req, res, next) => {
    const {skills} = req.body
    const {user} = req.body.project
    req.body.project.user_id = user.id
    Project.create(req.body.project)
    .then(createdProject => {
        return createdProject.setUser(user.id)
    })
    .then(createdProject => {
      return createdProject.addSkills(skills)
    })
    .then((addedSkills) => {
      return User.findOne({
      where: {
        id: user.id
      },
      include: [
        {model:Project, include:[Skill]}
      ]
    })})
    .then(projectUser => {
      return esClient.update({
      index: 'data',
      type: 'user',
      id: `${user.id}`,
      body: {
        doc:projectUser.get()
      }
    })})
    .then(() => res.sendStatus(201))
    .catch(next)
  })

  // search bar
  .post('/search', (req, res, next) => {
    const query = req.body.query
      ? {multi_match: {query: req.body.query, fields: ['description', 'skill.title']}}
      : {match_all: {}}

    esClient.search({
      index: 'data',
      type: 'project',
      body: {query}
    })
    .then(results => {
      var grouped = _.groupBy(results.hits.hits, (p) => {
        return p._source.user_id
      })
      return res.status(200).json(grouped)
    })
    .catch(next)
  })

  // advanced search
  .post('/search/advanced', (req, res, next) => {
    const {body} = req
    esClient.search({body, index: 'data', type: 'project'})
    .then(advancedResults => {
      var grouped = _.groupBy(advancedResults, (p) => {
        return p._source.user_id
      })
      return res.status(200).json(grouped)
    })
    .catch(next)
  })

  // project screenshot
  .get('/screenshots/sign-s3', (req, res, next) => {
    const s3 = new aws.S3({
      accessKeyId: 'AKIAJBADUWOAWQFRHKKQ',
      secretAccessKey: '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'
    })
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `screenshots/${fileName}`,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.error(err)
        return res.end
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      }
      res.write(JSON.stringify(returnData))
      res.end()
    })
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
      .then(updatedProject => {
        if (skills) return updatedProject.setSkills(skills)
        else return updatedProject
      })
      .then(editedProject => {
        return User.findById(project.user_id, {
          include: [{model: Project, include: [Skill]}]
        })
      })
      .then(foundUser => esClient.update({
        index: 'data',
        type: 'user',
        id: foundUser.id,
        body: {doc: foundUser.get()}
      }))
      .then(() => res.sendStatus(200))
      .catch(next)
    })

  .delete('/:id',
    (req, res, next) => {
      let id = null
      Project.findById(req.params.id)
      .then(project => {
        id = project.user_id
        return project.destroy()
      })
      .then(deletedProject => {
        return User.findById(id, {
          include: [{model: Project, include: [Skill]}]
        })
      })
      .then(updatedUser => esClient.update({
        index: 'data',
        type: 'user',
        id: updatedUser.id,
        body: {doc: updatedUser.get()}
      }))
      .then(() => res.sendStatus(204))
      .catch(next)
    })
