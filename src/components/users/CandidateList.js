import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CandidateList = props => {
  console.log("LIST ", props.users)
  return (
  <div className='JobList'>
    {props.filtered &&
      <div className='search-header'>
        <Row>
          <h2>Search Results</h2>
        </Row>
      </div>
    }
    {props.users && props.users.map((user, i) => {
      let skills = new Set([])
      if(user.projects){
        user.projects.forEach(p => {
          if(p.skills){
            p.skills.forEach(s => {
              skills.add(s.title)
            })
          }
        })
      }
      skills = [...skills].join(' ')
      return (
        <LinkContainer className='JobCard' key={i} to={`/users/${user.id}`}>
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
             <h2 className='JobCard-title'>{user.email} | {user.first_name} {user.last_name} | Project Count: {user.projects.length}</h2>
             <p className='JobCard-skills'>{skills}</p>
           </Col>
          </Row>
        </LinkContainer>
      )
    })}
  </div>
)}

// <Col xs={12} sm={6} md={6} lg={6}>
//   <Row>
//     <Col xs={12} sm={6} md={6} lg={6}>
//       <h2 className='JobCard-payrate'>
//         {user.first_name}
//       </h2>
//     </Col>
//     <Col xs={12} sm={6} md={6} lg={6}>
//       <p className='JobCard-location'>{`${job.city}, ${job.state}`}</p>
//       {job.employment_types && job.employment_types.map((type, i) => (
//         <span key={i} className='JobCard-type'>{type}</span>
//       ))}
//     </Col>
//   </Row>
// </Col>

export default CandidateList
