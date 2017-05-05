'use strict'

const {ENUM} = require('sequelize')

module.exports = db => db.define('jobApplication', {
  pile: ENUM('yes', 'no', 'maybe')
}, {
  instanceMethods: {
    sort: function(pileName) {
      // add job application to virtual yes, no or maybe 'pile'
      this.pile = pileName
      return this.save()
    },
    //TODO: add instance methods for filtering and processing piles,
    // e.g., find all the yes applicants, autosend form rejections to no pile, etc...
  }
})
