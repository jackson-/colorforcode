// const stripe = require('stripe')('API_SECRET')
const nodemailer = require('nodemailer')
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2')
const db = require('APP/db')
const {ReferralCode} = db
const Promise = require('bluebird')
const job_application = require('APP/server/emails/job_application')

module.exports = require('express').Router()
  .post('/', (req, res, next) => {
    // TODO Extract out payment route
    const info = {
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        code:`${req.body.name[0]}` + Math.random().toString(36).substr(2, 9),
    }
    console.log("INFO", info)
    return ReferralCode.create(info).then((created) => {
        return res.status(201).send(info.code)
    })
    .catch(err => next(err))
  })