import React, { Component } from 'react'
import { Row, Col, Button, FormControl, ControlLabel } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './JobDetail.css'

class JobInfoDisplay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  handleChange = event => {
    this.setState({email: event.target.value})
  }

  applyToJob = () => {
    const {user, job, receiveAlert, receiveNext, applyToJob, history} = this.props
    if (!user) {
      receiveNext(`/jobs/${job.id}`)
      receiveAlert({
        type: 'error',
        style: 'warning',
        title: 'Not signed in',
        body: 'Welcome! Log in or register for an account, then we\'ll send you back to apply to this job.',
        next: '',
        footer: true
      })
    } else {
      applyToJob(user, job.id, history)
    }
  }

  saveJob = () => {
    const {user, job, saveJob, receiveAlert, receiveNext} = this.props
    if (!user) {
      receiveNext(`/jobs/${job.id}`)
      receiveAlert({
        type: 'error',
        style: 'warning',
        title: 'Not signed in',
        body: 'Welcome! Log in or register for an account, then we\'ll send you back to save this job.',
        next: '',
        footer: true
      })
    } else {
      let savedJobsArr = user.savedJobs.map(j => j.id)
      savedJobsArr.push(job.id)
      saveJob({userId: user.id, savedJobsArr})
    }
  }

  unsaveJob = () => {
    const {user, job, unsaveJob} = this.props
    let savedJobsArr = user.savedJobs.filter(j => j.id !== job.id).map(j => j.id)
    unsaveJob({userId: user.id, savedJobsArr})
  }

  render () {
    const {job, user} = this.props
    let skills, employer, datePosted, saved, applied

    if (job) {
      employer = job.employer
      datePosted = new Date(job.created_at).toDateString()
      if (job.skills) {
        skills = job.skills.map((skill, i) => skill.title)
      }
    }

    if (user && job) {
      saved = user.savedJobs.filter(j => j.id === job.id).length > 0
      applied = user.applications.filter(a => a.id === job.id).length > 0
    }
    return (
      <Row className='JobInfo Dashboard__content--white'>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className='JobInfo--header'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col className='JobInfo__header-left' xs={12} sm={6} md={6} lg={6}>
                  <h1 className='JobInfo--header-title'>{job.title}</h1>
                  <h5 className='JobInfo--header-employer'>{employer.name}</h5>
                  <p className='JobInfo--header-location'>{`${job.location}`}</p>
                </Col>
                <Col className='JobInfo__header-right' xs={12} sm={6} md={3} mdOffset={3} lg={3} lgOffset={3}>
                  {
                    job.pay_rate &&
                    <h5 className='JobInfo--header-payrate'>
                      {
                        job.compensation_type === 'Hourly'
                          ? `Pay: ${job.pay_rate}/hr`
                          : `Pay: ${job.pay_rate}/yr`
                      }
                    </h5>
                  }
                  {job.employment_types && job.employment_types.map((type, i) => (
                    <span key={i} className='JobInfo--header-type'>{type}</span>
                  ))}
                  <p className='JobInfo--header-date'>{`Posted on ${datePosted}`}</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='JobInfo--body'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <div className='JobInfo__container-flex--sidebar'>
                  <Col className='JobInfo--summary' xs={12} sm={7} md={8} lg={8}>
                    <section className='JobInfo--summary-section'>
                      <h2>Description</h2>
                      <div dangerouslySetInnerHTML={{__html: job.description}} />
                    </section>
                    <section className='JobInfo--summary-section'>
                      <h2>Key Skills</h2>
                      {skills && skills.map((skill, i) => (
                        <span key={i} className='skill-chip'>{skill}</span>
                      ))}
                    </section>
                    <section className='JobInfo--summary-section'>
                      <h2>Travel Required</h2>
                      <p>{job.travel_requirements}</p>
                    </section>
                  </Col>
                  <Col className='JobInfo--sidebar' xs={12} sm={5} md={4} lg={4}>
                    <Button className='btn-oval' onClick={this.applyToJob} disabled={applied}>
                      {applied ? `YOU'VE APPLIED` : 'APPLY FOR JOB'}
                    </Button>
                    <Button
                      className='btn-oval btn-oval__black'
                      onClick={!saved ? this.saveJob : this.unsaveJob}
                    >
                      {!saved ? 'SAVE JOB' : 'UNSAVE JOB'}
                    </Button>
                    <div className='JobInfo--subscribe-container'>
                      <h4>
                        Get alerted about similar jobs!
                      </h4>
                      <form>
                        <ControlLabel srOnly>Email</ControlLabel>
                        <FormControl
                          type='email'
                          placeholder='EMAIL'
                          onChange={this.handleChange}
                        />
                        <Button type='submit' className='JobInfo--subscribe-button'>
                          SUBSCRIBE
                        </Button>
                      </form>
                    </div>
                  </Col>
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

JobInfoDisplay.propTypes = {
  user: PropTypes.any,
  history: PropTypes.object,
  match: PropTypes.object,
  job: PropTypes.object,
  saveJob: PropTypes.func,
  unsaveJob: PropTypes.func,
  applyToJob: PropTypes.func,
  receiveNext: PropTypes.func,
  receiveAlert: PropTypes.func
}

export default JobInfoDisplay
