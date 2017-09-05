let SearchModel = require('pg-search-sequelize')

module.exports = new SearchModel(
  (sequelize, DataTypes) => sequelize.define('JobMaterializedView', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: DataTypes.STRING,
    application_email: DataTypes.STRING,
    cc_email: DataTypes.STRING,
    application_url: DataTypes.STRING,
    coords: DataTypes.GEOMETRY('POINT', 4326),
    location: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    employment_types: DataTypes.ARRAY(DataTypes.STRING),
    pay_rate: DataTypes.STRING,
    compensation_type: DataTypes.STRING,
    travel_requirements: DataTypes.STRING
  }, {
    tableName: 'job_materialized_view',
    referenceModel: 'Job',
    timestamps: false,
    search: true,
    defaultScope: {
      attributes: {
        exclude: ['id']
      },
      include: [
        {
          model: db.models.Skill,
          through: db.models.JobSkill
          associationType: 'belongsToMany',
          attributes
        }
      ]
    }
  })
)
