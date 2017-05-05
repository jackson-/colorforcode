'use strict'

const Sequelize = require('sequelize')
const db = require('..')

module.exports = db => db.define('job', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

// Belongs to Many associations create a join table.

// In this case we've defined JobApplicant ourselves in order to add additional
// attributes beyond the primary keys of the Job and User tables.

// Both Job and User instances will have get, set and add accessor methods.
// User instances have getApplications, setApplications, addApplication(s),
// all of which return promises.
// refer to http://docs.sequelizejs.com/en/v3/api/associations/belongs-to-many/
/*
   e.g., router.get('/:jobId', (req, res, next) => {
           Job.findById(req.params.jobId)
           .then(job => {
             job.getApplicants()
             .then(applicants => res.send(applicants))
             .catch(next)
           })
         })
*/

module.exports.associations = (Job, {User, JobApplication}) => {
  Job.belongsToMany(User, {
    as: 'applicant',
    through: JobApplication,
    foreignKey: 'job_id'
  })
}
