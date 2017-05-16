'use strict'

// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
const {STRING, TEXT, JSON, VIRTUAL, INTEGER, ENUM, DATE, ARRAY} = require('sequelize')

module.exports = db => db.define('user', {
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
  zip_code: STRING,
  country: STRING,
  city_state: STRING,
  picture_url: STRING,
  email: {
      type: STRING,
      validate: {
          isEmail: true,
          notEmpty:true
      }
  },
  last_login: DATE,
  work_auth: STRING,
  employment_type: {
      type: ARRAY(STRING),
  },
  work_experience: {
      type: ARRAY(JSON),
  },
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
// attributes beyond the primary keys of the Job and User tables.

// Both Job and User instances will have get, set and add accessor methods.
// User instances have getApplications, setApplications, addApplication(s),
// all of which return promises.
// refer to http://docs.sequelizejs.com/en/v3/api/associations/belongs-to-many/
/*
   e.g., router.post('/:userId/applications/:applicationId', (req, res, next) => {
           User.findById(req.params.userId)
           .then(user => {
             user.addApplication(req.params.applicationId) // takes an instance or its id
             .then(application => res.sendStatus(201))
             .catch(next)
           })
         })
*/

module.exports.associations = (User, {OAuth, Job, JobApplication}) => {
  User.hasOne(OAuth)
  User.belongsToMany(Job, {
    as: 'applications',
    through: JobApplication,
    foreignKey: 'application_id'
  })
}

function setEmailAndPassword(user) {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return bcrypt.hash(user.get('password'), 10)
    .then(hash => user.set('password_digest', hash))
}
