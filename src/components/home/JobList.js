import React from 'react'
import './Home.css'
import { Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './JobCard.css'

const JobList = props => (
  <div className='JobList'>
    {props.jobs && props.jobs.map((job, i) => {
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
                   {job.compensation_type === 'Hourly'
                      ? `${job.pay_rate}/hr`
                      : job.pay_rate
                   }
                 </h2>
               </Col>
               <Col xs={12} sm={6} md={6} lg={6}>
                 <p className='JobCard-location'>{`${job.city}, ${job.state}`}</p>
                 {job.employment_types && job.employment_types.map((type, i) => (
                   <span key={i} className='JobCard-type'>{type}</span>
                 ))}
               </Col>
             </Row>


           </Col>
         </Row>
       </LinkContainer>
      )
    })}
  </div>
)

export default JobList
