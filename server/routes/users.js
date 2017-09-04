const db = require('APP/db')
const {User, Employer, Skill, Project} = db
const aws = require('aws-sdk')
const S3_BUCKET = 'hireblack'
const elasticsearch = require('elasticsearch')
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
})
const tinify = require("tinify");
tinify.key = "lm8HbN3+BXgdBe9KvYLG3+KkS7SISwCHXcbW1ybx";

module.exports = require('express').Router()

  .get('/', (req, res, next) => {
    User.findAll({include: [
      {model: Project, include: [Skill]},
    ], limit:10}).then(result => {
        return res.status(200).json(result)
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
    //
    // SELECT DISTINCT ON(id) id, * FROM (
    //   SELECT *,
    //   (SELECT array_agg(row_to_json(project.*)) FROM project WHERE project.job_id=job.id) AS projects,
    //    setweight(to_tsvector(user.title), 'A') || setweight(to_tsvector(user.summary), 'B') || setweight(to_tsvector('simple', coalesce(string_agg(project.title, ' '))), 'B') as document
    //  FROM "user" GROUP BY user.id) p_search WHERE p_search.document @@ to_tsquery('english', ' & react') ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', ' & react')) DESC;

    const {query} = req.body
    const options = {
        model: db.User,
        hasJoin:true,
    }
    "(SELECT array_agg(row_to_json(skill.*)) FROM skill LEFT JOIN ProjectSkill ON ProjectSkill.skill_id=skill.id WHERE ProjectSkill.project_id=project.id) AS skills, "
    let q = 'data'
    const db_query = "SELECT DISTINCT ON(id) id, * "+
      'FROM (SELECT "user".*, ' +
        // `ST_Distance(job.the_geom, ST_MakePoint(${body.coords})::geography) as distance, ` +
         `(SELECT json_agg(json_build_object('title', project.title, 'skills', (SELECT array_agg(row_to_json(skill.*)) FROM skill LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id WHERE "ProjectSkill".project_id=project.id))) FROM project WHERE project.user_id="user".id) AS projects, ` +
         'to_tsvector("user".title) || ' +
         'to_tsvector("user".summary) || ' +
         "to_tsvector(project.title) as document " +
        //  'to_tsvector("simple", coalesce(string_agg(project.title, " "))) as document ' +
      'FROM "user" ' +
      'JOIN project ON project.user_id = "user".id ' +
      'INNER JOIN "ProjectSkill" ON "ProjectSkill".project_id = project.id ' +
      'INNER JOIN skill ON skill.id = "ProjectSkill".project_id ' +
      'GROUP BY "user".id, project.id, skill.id) p_search ' +
      "WHERE " +
      `p_search.document @@ to_tsquery('english', '${q}') ` +
      `ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC;`
      console.log("QUERY ", db_query)
    db.query( db_query,
      options).then((result) =>{
        console.log("RESULT", result)
        return res.status(200).json(result)
    }).catch(next);
  })

  .post('/search/advanced', (req, res, next) => {
    const {body} = req
    esClient.search({body, index: 'data', type: 'user'})
    .then(advancedResults => res.status(200).json(advancedResults.hits.hits))
    .catch(next)
  })

  // .get('/avatars/sign-s3', (req, res) => {
  //   var source = tinify.fromFile(req.query['file-name']);
  //   const fileName = req.query['file-name']
  //   const fileType = req.query['file-type']
  //   const s3Params = {
  //     Bucket: S3_BUCKET,
  //     Key: `avatars/${fileName}`,
  //     Expires: 60,
  //     ContentType: fileType,
  //     ACL: 'public-read'
  //   }
  //
  //   s3.getSignedUrl('putObject', s3Params, (err, data) => {
  //     if (err) {
  //       console.error(err.stack)
  //       return res.end()
  //     }
  //     const returnData = {
  //       signedRequest: data,
  //       url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
  //     }
  //     res.write(JSON.stringify(returnData))
  //     res.sendStatus(200)
  //   })
  .get('/avatars/sign-s3', (req, res) => {
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const s3 = new aws.S3({
      accessKeyId: 'AKIAJBADUWOAWQFRHKKQ',
      secretAccessKey: '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'
    })
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `avatars/${fileName}`,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.error(err)
        return res.end()
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      }
      res.write(JSON.stringify(returnData))
      res.end()
    })
  })

  .get('/resumes/sign-s3', (req, res) => {
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const s3 = new aws.S3({
      accessKeyId: 'AKIAJBADUWOAWQFRHKKQ',
      secretAccessKey: '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'
    })
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: `resumes/${fileName}`,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.error(err)
        return res.end()
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      }
      res.write(JSON.stringify(returnData))
      res.end()
    })
  })

  .get('/:id', (req, res, next) => {
    let body = {
      query: {match: {id: req.params.id}},
      from: 0
    }
    esClient.search({body, index: 'data', type: 'user'})
    .then(results => {
      return res.status(200).json(results.hits.hits[0])
    })
    .catch(next)
  })

  .put('/:id', (req, res, next) => {
    const {user, savedJobsArr} = req.body

    User.findById(req.params.id)
    .then(foundUser => {
      // the same route is used to save jobs for users and to update users,
      // but these tasks are never simultaneous
      return savedJobsArr
        ? foundUser.setSavedJobs(savedJobsArr)
        : foundUser.update(user)
    })
    .then(() => {
      return User.findById(req.params.id, {
        include: [{model: Project, include: [Skill]}]
      })
    })
    .then(updatedUser => {
      // employer-users aren't in our ES data layer
      if (!updatedUser.is_employer) {
        return esClient.update({
          index: 'data',
          type: 'user',
          id: req.params.id,
          body: {doc: updatedUser.get()}
        })
      }
      return
    })
    .then(() => res.sendStatus(200))
    .catch(next)
  })
