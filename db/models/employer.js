'use strict'

const Sequelize = require('sequelize')
const db = require('APP/db')
const {Job} = db

module.exports = db => db.define('employer', {
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
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
          const all = oldListings.concat(newListings)
          return employer.setListings(all)
          // ^'set' would unassociate old job listings while associating new ones
          //  if we didn't concatenate them with the already associated listings
        })
      })
    }
  }
})

// Has Many associations add source id column to the target table,
// in this case an employer id attribute is added to the job table.

//Employer instances have the accessor methods getListings and setListings.
/*
   e.g., router.post('/:employerId/jobs', (req, res, next) => {
           Employer.findById(req.params.employerId)
           .then(employer => employer.addListings(req.body)
           .then(listings => res.sendStatus(201))
           .catch(next)
         })
*/

module.exports.associations = (Employer, {Job}) => {
  Employer.hasMany(Job, {as: 'Listings'})
}
