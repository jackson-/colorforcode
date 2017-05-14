'use strict'

const db = require('APP/db')
    , {User, Employer, Skill, Job, Promise, JobSkillRelationship} = db
    , {mapValues} = require('lodash')
function seedEverything() {
  const seeded = {
    users: users(),
    employers: employers(),
    skills: skills(),
  }
  seeded.jobs = jobs(seeded)
  seeded.relationships = relationships(seeded)

  return Promise.props(seeded)
}



const users = seed(User, {
  devin: {
    email: 'devin@123.com',
    name: 'Devin Jackson',
    password: '123',
  },
  chloe: {
    name: 'Chloe Rice',
    email: 'chloe@123.com',
    password: '123'
  },
})

const employers = seed(Employer, {
  airbnb: {
    email: 'emp1@123.com',
    name: 'AirBnB',
    password: '123',
  },
  google: {
    name: 'Google',
    email: 'emp2@123.com',
    password: '123'
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
  ({users, employers, skills}) => ({
    // The easiest way to seed associations seems to be to just create rows
    // in the join table.
    'full_stack': {
      employer_id: employers.google.id,
      title:'Full Stack Dev',
      description:'This is ajob for a full stack dev',
      application_method:'email',
      application_emails:['emp1@123.com', 'emp2@123.com'],
      city:'Brooklyn',
      state:'NY',
      country:'United States',
      zip_code:'11207',
      employment_types:['Full-time', 'Part-time'],
      pay_rate:'Hourly',
      compensation:'$80',
      travel_requirements:'None',
      remote:false,
    },
    'dev_ops': {
      employer_id: employers.airbnb.id,
      title:'DevOps',
      description:'This is a job for a devops dude',
      application_method:'email',
      application_emails:['emp1@123.com', 'emp2@123.com'],
      city:null,
      state:null,
      country: null,
      zip_code:null,
      employment_types:['Full-time'],
      pay_rate:'Hourly',
      compensation:'$100',
      travel_requirements:'None',
      remote:true,
    },
  })
)

const relationships = seed(JobSkillRelationship,
  // We're specifying a function here, rather than just a rows object.
  // Using a function lets us receive the previously-seeded rows (the seed
  // function does this wiring for us).
  //
  // This lets us reference previously-created rows in order to create the join
  // rows. We can reference them by the names we used above (which is why we used
  // Objects above, rather than just arrays).
  ({jobs, skills}) => ({
    // The easiest way to seed associations seems to be to just create rows
    // in the join table.
    1: {
      job_id: jobs.full_stack.id,
      skill_id:skills.react.id,
    },
    2: {
      job_id: jobs.full_stack.id,
      skill_id:skills.mongo.id,
    },
    3: {
      job_id: jobs.full_stack.id,
      skill_id:skills.node.id,
    },
    4: {
      job_id: jobs.dev_ops.id,
      skill_id:skills.nginx.id,
    },
    5: {
      job_id: jobs.dev_ops.id,
      skill_id:skills.gunicorn.id,
    },
    6: {
      job_id: jobs.dev_ops.id,
      skill_id:skills.aws.id,
    },
  })
)

if (module === require.main) {
  console.log('seeding')
  db.didSync
    .then(() => db.sync({force: true}))
    .then(seedEverything)
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
      .then(rows => Promise.props(
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
      )
      .then(seeded => {
        console.log(`Seeded ${Object.keys(seeded).length} ${Model.name} OK`)
        return seeded
      }).catch(error => {
        console.error(`Error seeding ${Model.name}: ${error} \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {users, employers, jobs, skills})
