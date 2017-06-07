import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
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
    const {job} = this.props
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
                     ? `Pay: ${job.pay_rate}/hr`
                     : `Pay: ${job.pay_rate}/yr`
                  }
                </h5>
                {job.employment_types && job.employment_types.map((type, i) => (
                  <span key={i} className='JobInfo-type'>{type}</span>
                ))}
                <p className='JobInfo-date'>{`Posted on ${datePosted}`}</p>
              </Col>
            </Row>
            <Row className='JobInfo-summary'>
              <Col xs={12} sm={8} md={8} lg={8}>
                <p>{`Description:  ${job.description}`}</p>
                <p>Key Skills</p>
                {skill_list && <ul>{skill_list.map(skill => skill)}</ul>}
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <Button className='btn-oval' onClick={this.applyToJob}>
                  APPLY FOR JOB
                </Button>
                <Button className='btn-oval btn-oval__black'>
                  SAVE JOB
                </Button>
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
