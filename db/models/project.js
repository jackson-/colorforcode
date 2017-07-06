
const Sequelize = require('sequelize')
const db = require('..')

module.exports = db => db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  learning_point: Sequelize.TEXT,
  pain_point: Sequelize.TEXT,
  external_link: Sequelize.TEXT,
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

module.exports.associations = (Project, {User, Skill}) => {
  Project.belongsToMany(User, {
    through:"UserProject"
  })
  Project.belongsToMany(Skill, {
    through: 'ProjectSkill'
  })
}
