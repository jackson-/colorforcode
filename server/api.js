'use strict'
const db = require('APP/db')
const {User} = db
const passport = require('passport')
const api = require('express').Router()
// require('APP/config/passport/passport.js')(passport, User);
module.exports = api
  .use('/auth', require('./routes/auth'))
  .use('/users', require('./routes/users'))
  .use('/jobs', require('./routes/jobs'))
  .use((req, res) => res.status(404).end()) // No routes matched? 404.
