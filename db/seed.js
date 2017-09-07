const db = require('APP/db')
const {User, Employer, Skill, Job, Project, ProjectSkill, JobSkill} = db
const Promise = require('bluebird')
const {mapValues} = require('lodash')
const skillDictionary = require('APP/db/skills')

const employers = seed(Employer, {
  airbnb: {
    name: 'AirBnB',
    company_site: 'https://www.airbnb.com'
  },
  google: {
    name: 'Google',
    company_site: 'https://www.google.com'
  },
  colorforcode: {
    name: 'Color For Code',
    company_site: 'https://www.colorforcode.com'
  },
  shopify: {
    name: 'Shopify',
    company_site: 'https://www.shopify.com'
  }
})
// *** note that the longitude is first in the coordinates array, as is
// required by GeoJSON spec (which PostGIS uses)
const points = {
  bk: {
    type: 'Point',
    coordinates: [-73.8918897, 40.6655101],
    crs: { type: 'name', properties: { name: 'EPSG:32661' } }
  },
  on: {
    type: 'Point',
    coordinates: [-75.69314750000001, 45.4203521],
    crs: { type: 'name', properties: { name: 'EPSG:32661' } }
  },
  ca: {
    type: 'Point',
    coordinates: [-121.4599012, 38.5500434],
    crs: { type: 'name', properties: { name: 'EPSG:32661' } }
  }
}

const users = seed(User,
  ({users, employers, skills}) => ({
    rico: {
      first_name: 'Rico',
      last_name: 'Suarez',
      email: 'rico@123.com',
      password: '123',
      is_employer: true,
      coords: points.bk,
      location: 'Brooklyn, NY',
      'zip_code': '11207',
      status: 'active',
      employer_id: 2
    },
    devin: {
      email: 'devin@123.com',
      first_name: 'Devin',
      last_name: 'Jackson',
      password: '123',
      is_employer: false,
      coords: points.bk,
      'location': 'Brooklyn, NY',
      'zip_code': '11207',
      'employment_types': ['FullTime', 'Remote'],
      image_url: '',
      headline: 'I love code, this, that, and the third!',
      summary: '',
      title: 'Python Wizard',
      work_auth: 'US Citizen',
      personal_site: 'https://sliqback-hacks.io',
      github: 'https://github.com/jackson-',
      linkedin: 'https://linkedin.com/in/sliqbackhacks',
      twitter: 'https://twitter.com/sliqbackhacks',
      status: 'active'
    },
    chloe: {
      first_name: 'Chloe',
      last_name: 'Rice',
      email: 'chloe@123.com',
      password: '123',
      is_employer: false,
      zip_code: '95817',
      location: 'Sacramento, CA',
      coords: points.ca,
      image_url: 'https://s3.amazonaws.com/colorforcode/avatars/chloe-avatar.png',
      headline: 'I love code, dogs, and fruit!',
      summary: '',
      title: 'Frontend Sorceress',
      work_auth: 'US Citizen',
      employment_types: ['FullTime', 'Contract to Hire', 'Internship'],
      personal_site: 'https://chloe-rice.com',
      github: 'https://github.com/chloerice',
      linkedin: 'https://linkedin.com/in/chloemrice',
      twitter: 'https://twitter.com/theunifarmer',
      status: 'active'
    },
    hb1: {
      first_name: 'Devin',
      last_name: 'Blackson',
      email: 'devin@colorforcode.com',
      password: '123',
      is_employer: true,
      coords: points.bk,
      'location': 'Brooklyn, NY',
      'zip_code': '11207',
      employer_id: 3
    },
    hb2: {
      first_name: 'Chloe',
      last_name: 'Ice',
      email: 'chloe@colorforcode.com',
      password: '123',
      zip_code: '95817',
      location: 'Sacramento, CA',
      coords: points.ca,
      company_role: 'Engineer/Developer',
      employment_types: [],
      status: 'active',
      is_employer: true,
      employer_id: 3
    },
    chlotilde: {
      first_name: 'Chlotilde',
      last_name: 'Reisenheimer',
      is_employer: true,
      zip_code: 'K2P1L4',
      location: 'Ottawa, ON Canada',
      coords: points.on,
      company_role: 'Engineer/Developer',
      email: 'chlotilde@shopify.com',
      employment_types: [],
      status: 'active',
      password: '123',
      employer_id: 4
    }
  })
)

const projects = seed(Project,
  ({users}) => ({
    d1: {
      user_id: users.devin.id,
      title: 'Data Visualizererer: Make Your Data Sexy',
      screenshot: '',
      problem: 'This is a description',
      approach: 'This is how I approached it.',
      challenges: 'This really pissed me off',
      outcome: 'I learned so much yo',
      site: 'http://www.visualizererer.data',
      repo: 'https://github.com/visualizererer'
    },
    d2: {
      user_id: users.devin.id,
      title: 'Instaknow: Expert Answers Fast',
      screenshot: '',
      problem: 'This is a description',
      approach: 'This is how I approached it.',
      challenges: 'This really pissed me off',
      outcome: 'I learned so much yo',
      site: 'http://www.insta.know',
      repo: 'https://github.com/instaknow'
    },
    c1: {
      user_id: users.chloe.id,
      title: 'Where Can I Eat?: Gluten Free Restaurant Finder',
      screenshot: 'https://s3.amazonaws.com/colorforcode/screenshots/project-3-created-2017-08-28T12:21:24.691Z-by-user-3',
      problem: 'This is a description',
      approach: 'This is how I approached it.',
      challenges: 'This really pissed me off',
      outcome: 'I learned so much yo',
      site: 'http://www.wherecanieat.com',
      repo: 'https://github.com/where-can-i-eat'
    },
    c2: {
      user_id: users.chloe.id,
      title: 'Interactive Guide: Working with an OCD programmer',
      screenshot: 'https://s3.amazonaws.com/colorforcode/screenshots/project-4-created-2017-08-28T12:21:24.691Z-by-user-3',
      problem: 'This is a description',
      approach: 'This is how I approached it.',
      challenges: 'This really pissed me off',
      outcome: 'I learned so much yo',
      site: 'http://www.ocd-programmer.guide',
      repo: 'https://github.com/ocd-programmer'
    }
  })
)

const skills = seed(Skill, skillDictionary)

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
      full_stack: {
        'employer_id': employers.colorforcode.id,
        'title': 'Full Stack Dev',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': points.bk,
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['FullTime', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      dev_ops: {
        'employer_id': employers.colorforcode.id,
        'title': 'DevOps',
        'description': 'This is a job for a devops dude',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': null,
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['FullTime', 'Remote'],
        'pay_rate': '$100',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      ml: {
        'title': 'Machine Learning Expert',
        'description': `Work with the latest machine learning techniques and technologies to influence the innovation of products in a highly collaborative environment.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$100',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      ux: {
        'title': 'UX / Visual Designer',
        'description': `BlackRocks User Experience team is looking for a professional with experience conceptualizing and visualizing user interfaces for large scale enterprise web applications to help us design next generation user interfaces for our Aladdin platform.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      messaging: {
        'title': 'Messaging Engineer',
        'description': `Our client, a local Healthcare organization, is looking for a full-time Messaging Engineer. This individual will be part of a 7-12 member team of AD and Messaging Engineers (some offshore that do the overnight support).`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$90',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      net_dev: {
        'title': '.Net Developer (Junior)',
        'description': `An NYC government agency located in Brooklyn, NY is looking for a junior .NET Developer for a 6 month contract, with the strong possibility for a long term renewal.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$60',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      merchant: {
        'title': 'Merchant Success Engineer',
        'description': 'Help make commerce better for everyone while building the biggest Rails app in the world!',
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Remote', 'FullTime'],
        'pay_rate': '$120000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      backend: {
        'title': 'Backend Engineer',
        'description': 'Work on the largest Rails app in the world!',
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['FullTime'],
        'pay_rate': '$89000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      intern: {
        'title': 'Front End Developer Intern',
        'description': `4 month internship, Fall 2017 (9/5 - 12-22)\n\nCome help us build our new design system with React! \n\nYou'll be get to: \n\n~work on the largest Rails app on the planet\n~be treated like any other full time engineer\n~have an awesome dedicated mentor\n~eat fantastic meals catered daily by local restaurants (gluten free vegan options always!)`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      data: {
        'title': 'Data Analyst',
        'description': `We've got over 400,000 merchants from Tesla and Kanye West to small shops selling enamel pins. Help us build the best product to serve all of their needs by making our data talk!`,
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['FullTime'],
        'pay_rate': '$120000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      full_stack1: {
        'employer_id': employers.colorforcode.id,
        'title': 'Senior Full Stack Dev',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': points.bk,
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['FullTime', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      dev_ops1: {
        'employer_id': employers.colorforcode.id,
        'title': 'Senior DevOps Engineer',
        'description': 'This is a job for a devops dude',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': null,
        'coords': points.bk,
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['FullTime', 'Remote'],
        'pay_rate': '$100',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      ml1: {
        'title': 'Senior Machine Learning Architect',
        'description': `Work with the latest machine learning techniques and technologies to influence the innovation of products in a highly collaborative environment.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      ux1: {
        'title': 'Senior UX / Visual Designer',
        'description': `BlackRocks User Experience team is looking for a professional with experience conceptualizing and visualizing user interfaces for large scale enterprise web applications to help us design next generation user interfaces for our Aladdin platform.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      messaging1: {
        'title': 'Senior Messaging Engineer',
        'description': `Our client, a local Healthcare organization, is looking for a full-time Messaging Engineer. This individual will be part of a 7-12 member team of AD and Messaging Engineers (some offshore that do the overnight support).`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      net_dev1: {
        'title': '.Net Developer (Senior)',
        'description': `An NYC government agency located in Brooklyn, NY is looking for a senior .NET Developer for a 6 month contract, with the strong possibility for a long term renewal.`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.bk,
        'location': 'Brooklyn, NY',
        'zip_code': '11207',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.colorforcode.id
      },
      merchant1: {
        'title': 'Merchant Success Engineering Lead',
        'description': 'Help make commerce better for everyone while building the biggest Rails app in the world!',
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.bk,
        'location': 'New York, NY',
        'zip_code': '10009',
        'employment_types': ['Remote', 'FullTime'],
        'pay_rate': '$120000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      backend1: {
        'title': 'Backend Engineering Lead',
        'description': 'Work on the largest Rails app in the world!',
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['FullTime'],
        'pay_rate': '$89000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      intern1: {
        'title': 'Backend Developer Intern',
        'description': `4 month internship, Fall 2017 (9/5 - 12-22)\n\nCome help us build our new design system with React! \n\nYou'll be get to: \n\n~work on the largest Rails app on the planet\n~be treated like any other full time engineer\n~have an awesome dedicated mentor\n~eat fantastic meals catered daily by local restaurants (gluten free vegan options always!)`,
        'status': 'open',
        'application_email': '',
        'cc_email': '',
        'application_url': 'https://www.shopify.com/careers/fall-2017-internship',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Internship', 'FullTime'],
        'pay_rate': '$30',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      },
      data1: {
        'title': 'Senior Data Analyst',
        'description': `We've got over 400,000 merchants from Tesla and Kanye West to small shops selling enamel pins. Help us build the best product to serve all of their needs by making our data talk!`,
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': points.on,
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['FullTime'],
        'pay_rate': '$140000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      }
    })
  }
)

const job_skills = seed(JobSkill,
  ({skills, jobs}) => ({
    1: {
      job_id: jobs.full_stack.id,
      skill_id: skills.react.id
    },
    2: {
      job_id: jobs.full_stack.id,
      skill_id: skills.nginx.id
    },
    3: {
      job_id: jobs.dev_ops.id,
      skill_id: skills.mongodb.id
    },
    4: {
      job_id: jobs.dev_ops.id,
      skill_id: skills.node.id
    },
    5: {
      job_id: jobs.full_stack.id,
      skill_id: skills.node.id
    },
    6: {
      job_id: jobs.data.id,
      skill_id: skills.react.id
    },
    7: {
      job_id: jobs.data.id,
      skill_id: skills.python.id
    },
    8: {
      job_id: jobs.data.id,
      skill_id: skills.d3.id
    },
    9: {
      job_id: jobs.data.id,
      skill_id: skills.rails.id
    },
    10: {
      job_id: jobs.data.id,
      skill_id: skills.ruby.id
    },
    11: {
      job_id: jobs.data.id,
      skill_id: skills.scala.id
    },
    12: {
      job_id: jobs.dev_ops.id,
      skill_id: skills.aws.id
    },
    13: {
      job_id: jobs.dev_ops.id,
      skill_id: skills.docker.id
    },
    14: {
      job_id: jobs.backend.id,
      skill_id: skills.rails.id
    },
    15: {
      job_id: jobs.backend.id,
      skill_id: skills.ruby.id
    },
    16: {
      job_id: jobs.backend.id,
      skill_id: skills.python.id
    },
    17: {
      job_id: jobs.merchant.id,
      skill_id: skills.rails.id
    },
    19: {
      job_id: jobs.merchant.id,
      skill_id: skills.react.id
    },
    20: {
      job_id: jobs.merchant.id,
      skill_id: skills.javascript.id
    },
    21: {
      job_id: jobs.merchant.id,
      skill_id: skills.ruby.id
    },
    22: {
      job_id: jobs.merchant.id,
      skill_id: skills.html5.id
    },
    23: {
      job_id: jobs.merchant.id,
      skill_id: skills.css3.id
    },
    24: {
      job_id: jobs.merchant.id,
      skill_id: skills.git.id
    },
    25: {
      job_id: jobs.intern.id,
      skill_id: skills.react.id
    },
    26: {
      job_id: jobs.intern.id,
      skill_id: skills.javascript.id
    },
    27: {
      job_id: jobs.intern.id,
      skill_id: skills.d3.id
    },
    28: {
      job_id: jobs.intern.id,
      skill_id: skills.html5.id
    },
    29: {
      job_id: jobs.intern.id,
      skill_id: skills.css3.id
    },
    30: {
      job_id: jobs.intern.id,
      skill_id: skills.git.id
    }
  })
)

const project_skills = seed(ProjectSkill,
  ({skills, projects}) => ({
    1: {
      project_id: projects.d1.id,
      skill_id: skills.react.id
    },
    2: {
      project_id: projects.d1.id,
      skill_id: skills.nginx.id
    },
    3: {
      project_id: projects.d1.id,
      skill_id: skills.mongodb.id
    },
    4: {
      project_id: projects.d2.id,
      skill_id: skills.node.id
    },
    5: {
      project_id: projects.d2.id,
      skill_id: skills.react.id
    },
    6: {
      project_id: projects.d2.id,
      skill_id: skills.nginx.id
    },
    7: {
      project_id: projects.c1.id,
      skill_id: skills.mongodb.id
    },
    8: {
      project_id: projects.c1.id,
      skill_id: skills.node.id
    },
    9: {
      project_id: projects.c1.id,
      skill_id: skills.react.id
    },
    10: {
      project_id: projects.c2.id,
      skill_id: skills.nginx.id
    },
    11: {
      project_id: projects.c2.id,
      skill_id: skills.mongodb.id
    },
    12: {
      project_id: projects.c2.id,
      skill_id: skills.node.id
    }
  })
)

function getMethods (obj) {
  var res = []
  for (var m in obj) {
    if (typeof obj[m] === 'function') {
      res.push(m)
    }
  }
  return res
}


function seedEverything () {
  const seeded = {
    employers: employers(),
    users: users(),
    skills: skills()
  }
  seeded.jobs = jobs(seeded)
  seeded.projects = projects(seeded)
  seeded.job_skills = job_skills(seeded)
  seeded.project_skills = project_skills(seeded)
  return Promise.props(seeded)
}

if (module === require.main) {
  console.log('seeding')
  db.didSync
    .then(() => db.sync({force: true}))
    .then(seedEverything)
    // .then(seedAssociations)
    // .then(jobs => jobs.forEach(job => job.addSkills([1,2,3]).then(() => {console.log('GOT EM')}) ) )

    .finally(() => process.exit(0))
}

class BadRow extends Error {
  constructor (key, row, error) {
    super(error)
    this.cause = error
    this.row = row
    this.key = key
  }

  toString () {
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
function seed (Model, rows) {
  return (others = {}) => {
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
        console.log('TYPE', typeof rows)
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
        console.error(`Error seeding ${Model.name}: \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {users, employers, jobs, skills, projects})
