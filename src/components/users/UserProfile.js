import React, { Component } from 'react'
import { gettingUserById } from 'APP/src/reducers/actions/users'
import { Row, Col, Image, Glyphicon } from 'react-bootstrap'
import blankAvatar from 'APP/src/components/dashboard/blank-avatar.png'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import IconBar from '../utilities/icons/IconBar'
import TwitterIcon from '../utilities/icons/TwitterIcon'
import LinkIcon from '../utilities/icons/LinkIcon'
import GithubIcon from '../utilities/icons/GithubIcon'
import LinkedInIcon from '../utilities/icons/LinkedInIcon'
import Chips from '../utilities/chips/Chips'
import './UserProfile.css'

class UserProfile extends Component {

  componentWillMount () {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }

  render () {
    const {match} = this.props
    const user = this.props.user ? this.props.user._source : null
    const links = [
      {type: 'github', label: 'Github Profile', component: <GithubIcon />},
      {type: 'linkedin', label: 'LinkedIn Profile', component: <LinkedInIcon />},
      {type: 'twitter', label: 'Twitter Profile', component: <TwitterIcon />},
      {type: 'personal_site', label: 'Personal Site', component: <LinkIcon />}
    ]
    let icons = []
    if (user) {
      links.forEach(link => {
        if (user[link.type]) {
          icons.push({
            text: link.label,
            component: link.component,
            url: user[link.type]
          })
        }
      })
    }
    // below we're fixing the unnecessary padding when this component
    // is rendered by the applicant dashboard
    let paddingTop = match.path === '/users/:id' ? '60px' : '0'
    return (
      <Row className='UserDetail Dashboard__content--white' style={{paddingTop}}>
        {user &&
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className='UserDetail__header'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col xs={12} sm={12} md={3} lg={3}>
                  <Image
                    className='UserDetail__header-avatar'
                    circle
                    responsive
                    src={user.image_url ? user.image_url : blankAvatar}
                    alt={`${user.first_name}'s avatar`}
                  />
                </Col>
                <Col className='header-left' xs={12} sm={12} md={5} lg={5}>
                  <h1 className='UserDetail__header-name'>
                    {`${user.first_name} ${user.last_name}`}
                  </h1>
                  <IconBar icons={icons} />
                  <p>{user.headline}</p>
                </Col>
                <Col className='chip-container' xs={12} sm={12} md={4} lg={4}>
                  <div className='header-right'>
                    <p className='UserDetail__header-title'>{user.title}</p>
                    <p className='UserDetail__header-location'>
                      <Glyphicon glyph='globe' /> {`${user.location}`}
                    </p>
                    {
                      <Chips
                        type='round'
                        words={user.employment_types || []}
                        justify='center'
                        align='flex-start'
                      />
                    }
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='UserDetail__body'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col className='UserDetail__projects' xs={12} sm={7} md={8} lg={8}>
                  <h2>PROJECTS</h2>
                  <section className='UserDetail__project-section'>

                    <ul>
                      {user.projects && user.projects.map((project, i) => (
                        <li key={i} className='UserDetail__header-type'>
                          <h3>{project.title}</h3>
                          <p className='JobCard-skills'>{project.skills.map(skill => skill.title).join(', ')}</p>
                          <h3>Project Link</h3>
                          <p>{project.external_link}</p>
                          <h3>Description</h3>
                          <p>{project.description}</p>
                          <h3>Learning Point</h3>
                          <p>{project.learning_point}</p>
                          <h3>Learning Point</h3>
                          <p>{project.pain_point}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      }
      </Row>
    )
  }
}

UserProfile.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  getUser: PropTypes.func,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.users.selected
})

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(gettingUserById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
