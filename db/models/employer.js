'use strict'

const {STRING} = require('sequelize')
const db = require('APP/db')
const {Job} = db

module.exports = db => db.define('employer', {
  name: STRING,
  email: STRING
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
/*
   e.g., router.post('/:employerId/jobs', (req, res, next) => {
           Employer.findById(req.params.employerId)
           .then(employer => employer.addListings(req.body)
           .then(listings => res.sendStatus(201))
           .catch(next)
         })
*/

module.exports.associations = (Employer, {Job, User}) => {
  Employer.hasMany(Job, {as: 'Listings'})
  Employer.hasMany(User, {as: 'Recruiters'})
}
