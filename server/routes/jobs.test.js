const request = require('supertest')
const {expect} = require('chai')
const db = require('APP/db')
const app = require('../start')

/* global describe it before afterEach */

describe('/api/jobs', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('POST', () =>
    describe('Creates a j', () => {
      it('creates a user', () =>
        request(app)
          .post('/api/jobs')
          .send({
            title: 'JS Dev',
            description: 'Build me a million dollar app.',
            remote: false,
            employment_types: ['Full Time'],
            pay_rate: 'N/A',
            compensation: '80-100K',
            travel_requirements: 'N/A',
            skills: [
              {title: 'JavaScript', template: true},
              {title: 'Node.js', template: true}
            ]
          })
          .expect(201, response => {
            expect(response.job.skills.length).to.equal(2)
            expect(response.employer.name).to.equal('Etsy')
          })
        )
    }))
})
