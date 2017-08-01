import React, { Component } from 'react'
import { Row, Col, Button, FormControl, ControlLabel } from 'react-bootstrap'

import './JobDetail.css'

export default class JobInfoDisplay extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  handleChange = event => {
    this.setState({email: event.target.value})
  }

  render () {
    const {job, user} = this.props
    let skills, employer, datePosted

    if (job) {
      employer = job.employer
      datePosted = new Date(job.created_at).toDateString()
      if (job.skills) {
        skills = job.skills.map((skill, i) => skill.title)
      }
    }

    return (
      <div className='JobInfo'>
        <Row className='JobInfo--header'>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Row>
              <Col className='header-left' xs={12} sm={6} md={6} lg={6}>
                <h1 className='JobInfo--header-title'>{job.title}</h1>
                <h5 className='JobInfo--header-employer'>{employer.name}</h5>
                <p className='JobInfo--header-location'>{`${job.location}`}</p>
              </Col>
              <Col className='header-right' xs={12} sm={6} md={3} mdOffset={3} lg={3} lgOffset={3}>
                <h5 className='JobInfo--header-payrate'>
                  {job.compensation_type === 'Hourly'
                     ? `Pay: ${job.pay_rate}/hr`
                     : `Pay: ${job.pay_rate}/yr`
                  }
                </h5>
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
              <div className='container__flex--sidebar'>
                <Col className='JobInfo--summary' xs={12} sm={7} md={8} lg={8}>
                  <section className='JobInfo--summary-section'>
                    <h2>Description</h2>
                    <p>{job.description}</p>
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
                  {user &&
                    <div>
                      <Button className='btn-oval' onClick={this.props.applyToJob}>
                      APPLY FOR JOB
                      </Button>
                      <Button className='btn-oval btn-oval__black'>
                        SAVE JOB
                      </Button>
                    </div>
                  }
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
      </div>
    )
  }
}
