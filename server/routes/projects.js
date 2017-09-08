const _ = require('underscore')
const db = require('APP/db')
const {Project, Skill, User} = db
const aws = require('aws-sdk')
const S3_BUCKET = 'colorforcode'
const ACCESS_KEY_ID = 'AKIAJBADUWOAWQFRHKKQ'
const SECRET_ACCESS_KEY = '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'

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

  // add/update project screenshot
  .get('/screenshots/sign-s3', (req, res, next) => {
    const s3 = new aws.S3({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
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
