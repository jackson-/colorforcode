const db = require('APP/db')
const {Coupon, User, Employer, Skill, Job, Project, ProjectSkill, JobSkill} = db
const Promise = require('bluebird')


function check_jobs(){
  Job.findAll({where:{status:'open'}})
  .then((activeJobs) => {
    return Promise.map(activeJobs, (job, i) => {
      var d = new Date();
      var today = new Date();
      d.setDate(job.created_at.getDate()-30);
      today.setDate((new Date()).getDate()-30);
      if(today.getDate() === d.getDate()){
        return job.update({status:'closed'})
      } else{
        return
      }
    })
  })
}
check_jobs()
process.exit-(1)
