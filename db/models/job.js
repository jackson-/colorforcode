const {STRING, TEXT, ARRAY, GEOMETRY} = require('sequelize')

module.exports = db => db.define('job', {
  title: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: TEXT,
    allowNull: false
  },
  status: STRING,
  application_email: STRING,
  cc_email: STRING,
  application_url: STRING,
  coords: GEOMETRY('POINT', 32661),
  location: STRING,
  zip_code: STRING,
  employment_types: ARRAY(STRING),
  pay_rate: STRING,
  compensation_type: STRING,
  travel_requirements: STRING
})

// Belongs to Many associations create a join table.

// In this case we've defined JobApplicant and JobSkillRelationship ourselves in order to add additional
// attributes beyond the primary keys of the Job, Skill, and User tables.

// Both Job and User instances will have get, set and add accessor methods.
// User instances have getApplications, setApplications, addApplication(s),
// all of which return promises. The same follows for Job and Skill.
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

module.exports.associations = (Job, {User, Employer, Skill, JobSkill, JobApplication}) => {
  Job.belongsToMany(User, {
    as: 'applicants',
    through: 'JobApplication'
  })
  Job.belongsToMany(Skill, {
    through: 'jobskill'
  })
  Job.belongsTo(Employer)
}
