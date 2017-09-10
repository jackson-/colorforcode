import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const ProjectList = props => (
  <div className='ProjectList'>
    {props.projects && props.projects.map((data, i) => {
      const project = data
      return (
        <LinkContainer className='ProjectCard' key={i} to={`/dashboard/edit-project/${project.id}`}>
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <h2 className='ProjectCard-title'>{project.title}</h2>
              <p className='ProjectCard-skills'>
                {project.skills.map(skill => skill.title).join(', ')}
              </p>
            </Col>
          </Row>
        </LinkContainer>
      )
    })}
  </div>
)

export default ProjectList
