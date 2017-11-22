import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import './Home.css'
import './JobCard.css'

const JobList = ({jobs, filtered, total}) => (
  <div className='JobList'>
    {
      filtered &&
        <h2 className='Joblist__heading'>
          {`Search Results (${total})`}
        </h2>
    }
    {
      jobs && jobs.map((job, i) => {
        const payRate = job.pay_rate && job.pay_rate.charAt(0) !== '$'
          ? `$${job.pay_rate}`
          : job.pay_rate
        return (
          <LinkContainer className='JobCard' key={i} to={`/jobs/${job.id}`}>
            <Row>
              <Col xs={12} sm={6} md={6} lg={6}>
                <h2 className='JobCard-title'>{job.title}</h2>
                <p className='JobCard-skills'>{job.skills.map(skill => skill.title).join(', ')}</p>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <h2 className='JobCard-payrate'>
                      {
                        job.pay_rate &&
                        job.compensation_type === 'Hourly'
                          ? `${payRate}/hr`
                          : `${payRate}`
                      }
                    </h2>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <p className='JobCard-location'>{job.location && job.location}</p>
                    {job.employment_types && job.employment_types.map((type, i) => (
                      <span key={i} className='JobCard-type'>{type}</span>
                    ))}
                  </Col>
                </Row>
              </Col>
            </Row>
          </LinkContainer>
        )
      })
    }
  </div>
)

JobList.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object),
  filtered: PropTypes.bool,
  total: PropTypes.number
}

export default JobList
