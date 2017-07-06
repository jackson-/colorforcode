'use strict'

const db = require('APP/db')
const {User, Employer, Skill, Job, Project} = db
const Promise = require('bluebird')
const {mapValues} = require('lodash')

function seedEverything() {
  const seeded = {
    users: users(),
    employers: employers(),
    skills: skills(),
  }
  seeded.jobs = jobs(seeded)
  // seeded.projects = projects(seeded)
  // seeded.relationships = relationships(seeded)
  return Promise.props(seeded)
}

// const projects = seed(Project,
//   ({users}) => ({
//
//   })
// )

const users = seed(User,
  ({users, employers, skills}) => ({
      devin: {
        email: 'devin@123.com',
        name:'Devin Jackson',
        password: '123',
        is_employer:false
      },
      chloe: {
        name: 'Chloe Rice',
        email: 'chloe@123.com',
        password: '123',
        is_employer:false
      },
      hb1: {
        name: 'Devin Blackson',
        email: 'devin@hireblack.io',
        password: '123',
        is_employer:true,
      },
      hb2: {
        name: 'Chloe Ice',
        email: 'chloe@hireblack.io',
        password: '123',
        is_employer:true,

      },
}))

const employers = seed(Employer, {
  airbnb: {
    name: 'AirBnB',
    company_site: 'http://www.airbnb.com',
  },
  google: {
    name: 'Google',
    company_site: 'http://www.google.com'
  },
  hireblack: {
    name: 'HireBlack',
    company_site: 'http://www.hireblack.io'
  },
})

const skills = seed(Skill, {
  react: {title: 'react', template:true},
  mongo: {title: 'mongo', template:true},
  node: {title: 'node', template:true},
  nginx: {title: 'nginx', template:true},
  gunicorn: {title: 'gunicorn', template:true},
  aws: {title: 'aws', template:true},
})

const jobs = seed(Job,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  //
  // This lets us reference previously-created rows in order to create the join
  // rows. We can reference them by the names we used above (which is why we used
  // Objects above, rather than just arrays).
  ({users, employers, skills}) => {
    return ({
    // The easiest way to seed associations seems to be to just create rows
    // in the join table.
    'full_stack': {
      employer_id: employers.hireblack.id,
      title:'Full Stack Dev',
      description:'This is a job for a full stack dev',
      application_url:null,
      application_email:'emp1@123.com',
      cc_email: 'emp2@123.com',
      city:'Brooklyn',
      state:'NY',
      country:'US',
      zip_code:'11207',
      employment_types:['Full-time', 'Part-time'],
      compensation_type:'Hourly',
      pay_rate:'$80',
      travel_requirements:'None',
      remote:false,
    },
    'dev_ops': {
      employer_id: employers.hireblack.id,
      title:'DevOps',
      description:'This is a job for a devops dude',
      application_url:null,
      application_email:'emp1@123.com',
      cc_email: 'emp2@123.com',
      city:null,
      state:null,
      country: null,
      zip_code:null,
      remote:true,
      employment_types:['Full-time', 'Remote'],
      compensation_type:'Hourly',
      pay_rate:'$100',
      travel_requirements:'None'
    },
  })
}
)

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res;
}

function seedAssociations(){
  return Job.findAll()
}

if (module === require.main) {
  console.log('seeding')
  db.didSync
    .then(() => db.sync({force: true}))
    .then(seedEverything)
    .then(seedAssociations)
    .then(jobs => jobs.forEach(job => job.addSkills([1,2,3]).then(() => {console.log("GOT EM")}) ) )

    .finally(() => process.exit(0))
}

class BadRow extends Error {
  constructor(key, row, error) {
    super(error)
    this.cause = error
    this.row = row
    this.key = key
  }

  toString() {
    return `[${this.key}] ${this.cause} while creating ${JSON.stringify(this.row, 0, 2)}`
  }
}

// seed(Model: Sequelize.Model, rows: Function|Object) ->
//   (others?: {...Function|Object}) -> Promise<Seeded>
//
// Takes a model and either an Object describing rows to insert,
// or a function that when called, returns rows to insert. returns
// a function that will seed the DB when called and resolve with
// a Promise of the object of all seeded rows.
//
// The function form can be used to initialize rows that reference
// other models.
function seed(Model, rows) {
  return (others={}) => {
    if (typeof rows === 'function') {
      rows = Promise.props(
        mapValues(others,
          other =>
            // Is other a function? If so, call it. Otherwise, leave it alone.
            typeof other === 'function' ? other() : other)
      ).then(rows)
    }
    return Promise.resolve(rows)
      .then(rows => {
        console.log("TYPE",typeof rows)
        return Promise.props(
        Object.keys(rows)
          .map(key => {
            const row = rows[key]
            return {
              key,
              value: Promise.props(row)
                .then(row => Model.create(row)
                  .catch(error => { throw new BadRow(key, row, error) })
                )
            }
          }).reduce(
            (all, one) => Object.assign({}, all, {[one.key]: one.value}),
            {}
          )
        )
      })
      .then(seeded => {
        console.log(`Seeded ${Object.keys(seeded).length} ${Model.name} OK`)
        return seeded
      }).catch(error => {
        console.error(`Error seeding ${Model.name}: ${error} \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {users, employers, jobs, skills})
