// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
const {STRING, TEXT, VIRTUAL, BOOLEAN, ENUM, ARRAY, GEOMETRY, UUID, UUIDV4} = require('sequelize')

module.exports = db => db.define('user', {
  uuid: {
    type: UUID,
    defaultValue: UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  first_name: STRING,
  last_name: STRING,
  is_employer: BOOLEAN,
  zip_code: STRING,
  location: STRING,
  coords: GEOMETRY('POINT', 32661),
  image_url: STRING,
  resume_url: STRING,
  company_role: STRING,
  email: {
    type: STRING,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  headline: STRING,
  summary: TEXT,
  title: STRING,
  work_auth: STRING,
  employment_types: ARRAY(STRING),
  personal_site: STRING,
  github: STRING,
  linkedin: STRING,
  twitter: STRING,
  status: {
    type: ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  // We support oauth, so users may or may not have passwords.
  password_digest: STRING, // This column stores the hashed password in the DB, via the beforeCreate/beforeUpdate hooks
  password: VIRTUAL // Note that this is a virtual, and not actually stored in DB
}, {
  indexes: [{fields: ['email'], unique: true}],
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword
  },
  defaultScope: {
    attributes: {exclude: ['password_digest']}
  },
  instanceMethods: {
    // This method is a Promisified bcrypt.compare
    authenticate (plaintext) {
      return bcrypt.compare(plaintext, this.password_digest)
    }
  }
})

// Belongs to Many associations create a join table.

// In this case we've defined JobApplication ourselves in order to add additional
// attributes beyond the primary keys of the Job and User tables.

// Both Job and User instances will have get, set and add accessor methods.
// User instances have getApplications, setApplications, addApplication(s),
// all of which return promises.
// refer to http://docs.sequelizejs.com/en/v3/api/associations/belongs-to-many/
/*
   e.g., router.post('/:userId/applications/:applicationId', (req, res, next) => {
           User.findById(req.params.userId)
           .then(user => {
             user.addApplication(req.params.applicationId) // takes an instance or its id
             .then(application => res.sendStatus(201))
             .catch(next)
           })
         })
*/

module.exports.associations = (User, {OAuth, Job, Skill, Employer, Project}) => {
  User.belongsTo(Employer)
  User.hasOne(OAuth)
  User.belongsToMany(Skill, {
    through: 'UserSkill'
  })
  User.belongsToMany(Job, {
    as: 'applications',
    through: 'JobApplication',
    foreignKey: 'applicant_id'
  })
  User.belongsToMany(Job, {
    as: 'savedJobs',
    through: 'User_SavedJobs'
  })
  User.hasMany(Project)
}

function setEmailAndPassword (user) {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return bcrypt.hash(user.get('password'), 10)
    .then(hash => user.set('password_digest', hash))
}
