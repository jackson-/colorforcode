// bcrypt docs: https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcryptjs')
const {STRING, TEXT, VIRTUAL, BOOLEAN, ENUM, ARRAY, GEOMETRY, UUID, UUIDV4} = require('sequelize')

module.exports = db => db.define('referralcode', {
  uuid: {
    type: UUID,
    defaultValue: UUIDV4,
    validate: {
      isUUID: 4
    }
  },
  code: STRING,
  name: STRING,
  email: {
    type: STRING,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: STRING,
}, {
  indexes: [{fields: ['email'], unique: true}],
})

