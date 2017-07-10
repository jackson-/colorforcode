'use strict'

const db = require('APP/db')
const {User, Employer} = db
const aws = require('aws-sdk');
const S3_BUCKET = "hireblack";
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})

module.exports = require('express').Router()

    .get('/', (req, res, next) => {
      let body = {
        query: {match_all: {}},
        from: 0
      }
      esClient.search({body, index: 'data', type: 'user'})
      .then(results => {
        return res.status(200).json(results.hits.hits)
      })
      .catch(next)
    })
    .post('/', (req, res, next) =>
      User.create(req.body)
      .then(user => {
        if (user.is_employer) {
          return Employer.findOrCreate({
            where: {
              name: req.body.company_name,
              company_site: req.body.company_site
            }
          })
          .spread((employer, created) => user.setEmployer(employer.id))
        } else {
          res.status(201).json(user)
        }
      })
      .then(user => res.status(201).json(user))
      .catch(next)
    )
    .post('/search', (req, res, next) => {
      const query = req.body.query
        ? {multi_match: {query: req.body.query, fields: ['projects.skills.title', 'projects.description']}}
        : {match_all: {}}

      esClient.search({
        index: 'data',
        type: 'user',
        body: {query}
      })
      .then(results => res.status(200).json(results.hits.hits))
      .catch(next)
    })

    .post('/search/advanced', (req, res, next) => {
      const {body} = req
      esClient.search({body, index: 'data', type: 'user'})
      .then(advancedResults => res.status(200).json(advancedResults.hits.hits))
      .catch(next)
    })
    .get('/avatars/sign-s3', (req, res) => {
      const s3 = new aws.S3({
          accessKeyId: "AKIAJBADUWOAWQFRHKKQ",
          secretAccessKey: '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'
        });
      const fileName = req.query['file-name'];
      const fileType = req.query['file-type'];
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `avatars/${fileName}`,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
      };

      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
          console.log(err);
          return res.end();
        }
        const returnData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
      });
    })
  .get('/resumes/sign-s3', (req, res) => {
      const s3 = new aws.S3({
          accessKeyId: "AKIAJBADUWOAWQFRHKKQ",
          secretAccessKey: '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'
        });
      const fileName = req.query['file-name'];
      const fileType = req.query['file-type'];
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `resumes/${fileName}`,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
      };

      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
          console.log(err);
          return res.end();
        }
        const returnData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
      });
    })
  .get('/:id', (req, res, next) =>
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next))
  .put('/:id',
    (req, res, next) => {
      console.log("REQ", req.params, req.body)
      const {user} = req.body
      User.findById(req.params.id)
      .then(foundUser => foundUser.update(user))
      .then(() => res.sendStatus(200))
      .catch(next)
    })
