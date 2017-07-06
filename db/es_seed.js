(function () {
  'use strict';
  const db = require('APP/db')
  const {Job, Employer, Skill, User, Project} = db
  const elasticsearch = require('elasticsearch');
  const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

  const bulkIndex = function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index,
          _type: type,
          _id: item.id,
        }
      });

      bulkBody.push(item);
    });

    esClient.bulk({body: bulkBody})
    .then(response => {
      let errorCount = 0;
      response.items.forEach(item => {
        if (item.index && item.index.error) {
          console.log(++errorCount, item.index.error);
        }
      });
      console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
    })
    .catch(console.err);
  };

  // only for testing purposes
  // all calls should be initiated through the module
  const test = function test() {
    Job.findAll({ include: [Employer, Skill] })
      .then(jobs => {
        console.log(`${jobs.length} jobs parsed from database`);
        bulkIndex('data', 'job', jobs)
      })
      .catch((error) => {
        console.log("ERROR: ", error)
      })
    User.findAll({ where:{is_employer:false}, include: [{model:Project, include:[{model:Skill}]}] })
      .then(users => {
        console.log(`${users.length} users parsed from database`);
        bulkIndex('data', 'user', users)
      })
      .catch((error) => {
        console.log("ERROR: ", error)
      })

  };

  test();

  module.exports = {
    bulkIndex
  };
} ());
