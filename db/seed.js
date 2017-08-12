const db = require('APP/db')
const {User, Employer, Skill, Job, Project, ProjectSkill, JobSkill} = db
const Promise = require('bluebird')
const {mapValues} = require('lodash')

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
      skill_id: skills.mongo.id
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

const projects = seed(Project,
  ({users}) => ({
    d1: {
      user_id: users.devin.id,
      title: 'Data Visualizererer: Make Your Data Sexy',
      description: 'This is a description',
      learning_point: 'I learned so much yo',
      pain_point: 'This really pissed me off',
      external_link: 'http://www.google.com'
    },
    d2: {
      user_id: users.devin.id,
      title: 'Instaknow: Expert Answers Fast',
      description: 'This is a description',
      learning_point: 'I learned so much yo',
      pain_point: 'This really pissed me off',
      external_link: 'http://www.google.com'
    },
    c1: {
      user_id: users.chloe.id,
      title: 'Where Can I Eat?: Gluten Free Restaurant Finder',
      description: 'This is a description',
      learning_point: 'I learned so much yo',
      pain_point: 'This really pissed me off',
      external_link: 'http://www.google.com'
    },
    c2: {
      user_id: users.chloe.id,
      title: 'Interactive Guide: How to work with an OCD programmer',
      description: 'This is a description',
      learning_point: 'I learned so much yo',
      pain_point: 'This really pissed me off',
      external_link: 'http://www.google.com'
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
      project_id: projects.c1.id,
      skill_id: skills.mongo.id
    },
    4: {
      project_id: projects.c2.id,
      skill_id: skills.node.id
    }
  })
)

const users = seed(User,
  ({users, employers, skills}) => ({
    rico: {
      first_name: 'Rico',
      last_name: 'Suarez',
      email: 'rico@123.com',
      password: '123',
      is_employer: true,
      'coords': '40.6655101,-73.8918897',
      'location': 'Brooklyn, New York',
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
      'coords': '40.6655101,-73.8918897',
      'location': 'Brooklyn, New York',
      'zip_code': '11207',
      'employment_types': ['Full-time', 'Remote'],
      image_url: '',
      story: 'I love code, this, that, and the third!',
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
      coords: '38.5500434,-121.4599012',
      image_url: 'https://s3.amazonaws.com/hireblack/avatars/chloe-avatar.png',
      story: 'I love code, dogs, and fruit!',
      work_auth: 'US Citizen',
      employment_types: ['Full-time', 'Contract to Hire', 'Internship'],
      personal_site: 'https://chloe-rice.com',
      github: 'https://github.com/chloerice',
      linkedin: 'https://linkedin.com/in/chloemrice',
      twitter: 'https://twitter.com/theunifarmer',
      status: 'active'
    },
    hb1: {
      first_name: 'Devin',
      last_name: 'Blackson',
      email: 'devin@hireblack.io',
      password: '123',
      is_employer: true,
      'coords': '40.6655101,-73.8918897',
      'location': 'Brooklyn, New York',
      'zip_code': '11207',
      employer_id: 3
    },
    hb2: {
      first_name: 'Chloe',
      last_name: 'Ice',
      email: 'chloe@hireblack.io',
      password: '123',
      zip_code: '95817',
      location: 'Sacramento, CA',
      coords: '38.5500434,-121.4599012',
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
      coords: '45.4203521,-75.69314750000001',
      company_role: 'Engineer/Developer',
      email: 'chlotilde@shopify.com',
      employment_types: [],
      status: 'active',
      password: '123',
      employer_id: 4
    }
  })
)

const employers = seed(Employer, {
  airbnb: {
    name: 'AirBnB',
    company_site: 'https://www.airbnb.com'
  },
  google: {
    name: 'Google',
    company_site: 'https://www.google.com'
  },
  hireblack: {
    name: 'HireBlack',
    company_site: 'https://www.hireblack.io'
  },
  shopify: {
    name: 'Shopify',
    company_site: 'https://www.shopify.com'
  }
})

const skills = seed(Skill, {
  react: {title: 'react', template: true},
  mongo: {title: 'mongo', template: true},
  node: {title: 'node', template: true},
  nginx: {title: 'nginx', template: true},
  gunicorn: {title: 'gunicorn', template: true},
  aws: {title: 'aws', template: true},
  rails: {title: 'rails', template: true},
  python: {title: 'python', template: true},
  ruby: {title: 'ruby', template: true},
  django: {title: 'django', template: true},
  html5: {title: 'html5', template: true},
  css3: {title: 'css3', template: true},
  javascript: {title: 'javascript', template: true},
  d3: {title: 'd3', template: true},
  docker: {title: 'docker', template: true},
  git: {title: 'git', template: true},
  scala: {title: 'scala', template: true},
  go: {title: 'go', template: true}
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
      fake_1: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_1',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_2: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_2',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_3: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_3',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_4: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_4',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_5: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_5',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_6: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_6',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_7: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_7',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_8: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_8',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_9: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_9',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_10: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_10',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_11: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_11',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_12: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_12',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_13: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_13',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_14: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_14',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_15: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_15',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_16: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_16',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_17: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_17',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      fake_18: {
        'employer_id': employers.hireblack.id,
        'title': 'fake_18',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      full_stack: {
        'employer_id': employers.hireblack.id,
        'title': 'Full Stack Dev',
        'description': 'This is a job for a full stack dev',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': '',
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$80',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      dev_ops: {
        'employer_id': employers.hireblack.id,
        'title': 'DevOps',
        'description': 'This is a job for a devops dude',
        'status': 'open',
        'application_email': 'emp1@123.com',
        'cc_email': 'emp2@123.com',
        'application_url': null,
        'coords': '40.6655101,-73.8918897',
        'location': 'Brooklyn, New York',
        'zip_code': '11207',
        'employment_types': ['Full-time', 'Remote'],
        'pay_rate': '$100',
        'compensation_type': 'Hourly',
        'travel_requirements': 'None'
      },
      merchant: {
        'title': 'Merchant Success Engineer',
        'description': 'Help make commerce better for everyone while building the biggest Rails app in the world!',
        'status': 'open',
        'application_email': 'jobs@shopify.com',
        'cc_email': '',
        'application_url': '',
        'coords': '40.7275043, -73.9800645',
        'location': 'New York, NY',
        'zip_code': '10009',
        'employment_types': ['Remote', 'Full-time'],
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
        'coords': '45.4203521,-75.69314750000001',
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Full-time'],
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
        'coords': '45.4203521,-75.69314750000001',
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Internship', 'Full-time'],
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
        'coords': '45.4203521,-75.69314750000001',
        'location': 'Ottawa, ON Canada',
        'zip_code': 'K2P1L4',
        'employment_types': ['Full-time'],
        'pay_rate': '$120000',
        'compensation_type': 'Salary',
        'travel_requirements': 'None',
        'employer_id': employers.shopify.id
      }
    })
  }
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
        console.error(`Error seeding ${Model.name}: ${error} \n${error.stack}`)
      })
  }
}

module.exports = Object.assign(seed, {users, employers, jobs, skills})
