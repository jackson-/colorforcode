
const Sequelize = require('sequelize')

module.exports = db => db.define('job', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: Sequelize.STRING,
  application_email: Sequelize.STRING,
  cc_email: Sequelize.STRING,
  application_url: Sequelize.STRING,
  coords: Sequelize.STRING,
  location: Sequelize.STRING,
  zip_code: Sequelize.STRING,
  employment_types: Sequelize.ARRAY(Sequelize.STRING),
  pay_rate: Sequelize.STRING,
  compensation_type: Sequelize.STRING,
  travel_requirements: Sequelize.STRING,
  the_geom: 'geometry(Point,4326)',
},{ tableName: 'job',
    customHooks: {

    },
    hooks:{
      afterSave: models => models.JobMaterializedView.refresh(),
      afterValidate: function (job, options) {
         job.the_geom = db.fn('ST_SetSRID', db.fn('ST_MakePoint', job.coords.split(',')[0], job.coords.split(',')[0]), '4326');
       }
    },
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
    through: 'JobSkill'
  })
  Job.belongsTo(Employer)
}
