import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { applyingToJob } from 'APP/src/reducers/actions/jobs'
import './JobDetail.css'

class JobInfoDisplay extends Component {

  applyToJob = () => {
    this.props.sendApplication(
      this.props.user.id,
      this.props.job.id,
      this.props.history
    )
  }

  render() {
    const {job, user} = this.props
    let skill_list, employer, datePosted

    if (job) {
      employer = job.employer
      datePosted = new Date(job.created_at).toDateString()
      if (job.skills) {
        skill_list = job.skills.map((skill, i) => {
          return <li key={i}>{skill.title}</li>
        })
      }
    }

    return (
      <Row className='JobInfo'>
        {
          job &&
          <Col xs={12} sm={12} md={12} lg={12}>
            <Row className='JobInfo-header'>
              <Col className='header-left' xs={12} sm={6} md={6} lg={6}>
                <h1 className='JobInfo-title'>{job.title}</h1>
                <h5 className='JobInfo-employer'>{employer.name}</h5>
                <p className='JobInfo-location'>{`${job.city}, ${job.state}`}</p>
              </Col>
              <Col className='header-right' xs={12} sm={6} md={3} mdOffset={3} lg={3} lgOffset={3}>
                <h5 className='JobInfo-payrate'>
                  {job.compensation_type === 'Hourly'
                     ? `Compensation: ${job.pay_rate}/hr`
                     : `Compensation: ${job.pay_rate}/yr`
                  }
                </h5>
                {job.employment_types && job.employment_types.map((type, i) => (
                  <span key={i} className='JobInfo-type'>{type}</span>
                ))}
                <p className='JobInfo-date'>{`Posted on ${datePosted}`}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6} lg={6}>

                <p>{`Description:  ${job.description}`}</p>
                <p>{`Location:  ${job.city}, ${job.state} ${job.country}`}</p>
                <p>{`Telecommute: ${job.remote ? "Yes" : "No"}`}</p>
                <p>{`Pay Rate:  ${job.pay_rate}`}</p>
                <p>{`Compensation:  ${job.compensation}`}</p>
                <p>{`Travel Requirements:  ${job.travel_requirements}`}</p>
                <p>{`Posted on:  ${datePosted}`}</p>
                <p>Key Skills</p>
                {skill_list && <ul>{skill_list.map(skill => skill)}</ul>}
                {(user && !user.is_employer) &&
                  <button onClick={this.applyToJob}>Apply</button>
                }
              </Col>
            </Row>
          </Col>
        }
      </Row>
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
