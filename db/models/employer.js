'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
const {STRING, TEXT, JSON, VIRTUAL, INTEGER, ENUM, DATE, ARRAY} = require('sequelize')

module.exports = db => db.define('employer', {
  id: {
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER
  },
  first_name: {
      type: STRING,
      notEmpty: true
  },
  last_name: {
      type: STRING,
      notEmpty: true
  },
  company_name: STRING,
  picture_url: STRING,
  email: {
      type: STRING,
      validate: {
          isEmail: true,
          notEmpty:true
      }
  },
  last_login: DATE,
  status: {
      type: ENUM('active', 'inactive'),
      defaultValue: 'active'
  },
  password: STRING // Note that this is a virtual, and not actually stored in DB
}, {
  indexes: [{fields: ['email'], unique: true}],
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword,
  }
})

// Belongs to Many associations create a join table.

// In this case we've defined JobApplication ourselves in order to add additional
// attributes beyond the primary keys of the Job and Employer tables.

// Both Job and Employer instances will have get, set and add accessor methods.
// Employer instances have getApplications, setApplications, addApplication(s),
// all of which return promises.
// refer to http://docs.sequelizejs.com/en/v3/api/associations/belongs-to-many/
/*
   e.g., router.post('/:employerId/applications/:applicationId', (req, res, next) => {
           Employer.findById(req.params.employerId)
           .then(employer => {
             employer.addApplication(req.params.applicationId) // takes an instance or its id
             .then(application => res.sendStatus(201))
             .catch(next)
           })
         })
*/

module.exports.associations = (Employer, {OAuth, Job, JobApplication}) => {
  Employer.hasOne(OAuth)
  Employer.hasMany(Job)
}

function setEmailAndPassword(employer) {
  employer.email = employer.email && employer.email.toLowerCase()
  if (!employer.password) return Promise.resolve(employer)

  return bcrypt.hash(employer.get('password'), 10)
    .then(hash => employer.set('password_digest', hash))
}
