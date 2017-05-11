'use strict'

const db = require('../db')
const api = require('express').Router()

module.exports = api
  .use('/auth', require('./routes/auth'))
  .use('/users', require('./routes/users'))
  .use('/jobs', require('./routes/jobs'))
  .use((req, res) => res.status(404).end()) // No routes matched? 404.
