'use strict'

const {STRING} = require('sequelize')
const db = require('APP/db')
const {Job} = db

module.exports = db => db.define('employer', {
  name: STRING,
  company_site: STRING
}, {
  instanceMethods: {
    addListings: function(listingsArray) {
      const creatingNewJobs = listingsArray.length > 1
        ? Job.bulkCreate(listingsArray)
        : Job.create(listingsArray[0])

      creatingNewJobs
      .then(newListings => {
        return this.getListings()
        .then(oldListings => {
          const all = Array.isArray(newListings)
            ? oldListings.concat(newListings)
            : oldListings.push(newListings)
          return employer.setListings(all)
          // ^'set' would unassociate old job listings while associating new ones
          //  if we didn't concatenate them with the already associated listings
          // This returns a promise that if successful resolves to an array of
          // the employer's listings.
        })
      })
    },
    addRecruiters: function(recruiterArray) {
      const creatingNewRecruiters = listingsArray.length > 1
        ? User.bulkCreate(recruiterArray)
        : User.create(recruiterArray[0])

      creatingNewJobs
      .then(newRecruiters => {
        return this.getRecruiters()
        .then(oldRecruiters => {
          const all = Array.isArray(newRecruiters)
            ? oldRecruiters.concat(newRecruiters)
            : oldRecruiters.push(newRecruiters)
          return employer.setRecruiters(all)
          // ^'set' would unassociate old recruiters while associating new ones
          //  if we didn't concatenate them with the already associated recruiters.
          // This returns a promise that if successful resolves to an array of
          // the employer's recruiters.
        })
      })
    }
  }
})

// Has Many associations add source id column to the target table.
// In this case an employer id attribute is added to both the job and user tables.
// Users instances will only have employers if they are recruiters that signed up
// for an employer account (is_employer = true).

//Employer instances have the accessor methods getListings/setListings as well as
// getRecruiters and setRecruiters.

module.exports.associations = (Employer, {Job, User}) => {
  Employer.hasMany(Job, {as: 'Listings'})
  Employer.hasMany(User, {as: 'Recruiters'})
}

// bcrypt docs: https://www.npmjs.com/package/bcrypt
// const bcrypt = require('bcryptjs')
// const {STRING, TEXT, JSON, VIRTUAL, INTEGER, ENUM, DATE, ARRAY} = require('sequelize')
//
// module.exports = db => db.define('employer', {
//   first_name: {
//       type: STRING,
//       notEmpty: true
//   },
//   last_name: {
//       type: STRING,
//       notEmpty: true
//   },
//   company_name: STRING,
//   image_url: STRING,
//   email: {
//     type: STRING,
//     validate: {
//         isEmail: true,
//         notEmpty:true
//     }
//   },
//   last_login: DATE,
//   status: {
//     type: ENUM('active', 'inactive'),
//     defaultValue: 'active'
//   },
//   password: VIRTUAL // Note that this is a virtual, and not actually stored in DB
// }, {
//   indexes: [{fields: ['email'], unique: true}],
//   hooks: {
//     beforeCreate: setEmailAndPassword,
//     beforeUpdate: setEmailAndPassword,
//   }
// })

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

// module.exports.associations = (Employer, {OAuth, Job, JobApplication}) => {
//   Employer.hasOne(OAuth)
//   Employer.hasMany(Job)
// }
//
// function setEmailAndPassword(employer) {
//   employer.email = employer.email && employer.email.toLowerCase()
//   if (!employer.password) return Promise.resolve(employer)
//
//   return bcrypt.hash(employer.get('password'), 10)
//   .then(hash => employer.set('password_digest', hash))
// }
