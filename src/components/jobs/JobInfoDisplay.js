import React, {Component} from 'react'
import { connect } from 'react-redux'
import { applyingToJob } from 'APP/src/reducers/actions/jobs'

class JobInfoDisplay extends Component {
  applyToJob(){
    this.props.sendApplication(
      this.props.user.id,
      this.props.job.id,
      this.props.history
    )
  }

  render() {
    const {job, user} = this.props;
    let skill_list, employer;

    if (job) {
      employer = job.employer

      if (job.skills) {
        skill_list = job.skills.map((skill, i) => {
          return <li key={i}>{skill.title}</li>
        })
      }
    }

    return (
      <div id='job-display'>
        {job &&
          <div>
            <h1>Title: {job.title}</h1>
            {employer &&
              <h3>Company: {employer.name}</h3>}
            <p>Description: {job.description}</p>
            {job.state && job.city &&
              <p>{job.city}, {job.state} {job.country}</p>
            }
            <p>Telecommute: {job.remote ? "Yes" : "No"}</p>
            <p>Pay Rate: {job.pay_rate}</p>
            <p>Compensation: {job.compensation}</p>
            <p>Travel Requirements: {job.travel_requirements}</p>
            <p>Posted Since: {job.created_at}</p>

            {skill_list && <ul>{skill_list.map(skill => skill)}</ul>}
            {user && user.is_employer === false &&
              <button onClick={this.applyToJob.bind(this)}>Apply</button>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  history: state.router.history
})

const mapDispatchToProps = dispatch => ({
  sendApplication: (user_id, job_id, history) => dispatch(applyingToJob(user_id, job_id, history))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobInfoDisplay)
