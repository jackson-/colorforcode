<<<<<<< HEAD
const request = require('supertest')
const {expect} = require('chai')
const db = require('APP/db')
const app = require('../start')

/* global describe it before afterEach */

describe('/api/users', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('POST', () =>
    describe('when not logged in', () => {
      it('creates a user', () =>
        request(app)
          .post('/api/users')
          .send({
            email: 'beth@secrets.org',
            password: '12345'
          })
          .expect(201))

      it('redirects to the user it just made', () =>
        request(app)
          .post('/api/users')
          .send({
            email: 'eve@interloper.com',
            password: '23456',
          })
          .redirects(1)
          .then(res => expect(res.body).to.contain({
            email: 'eve@interloper.com'
          })))
    }))
})
