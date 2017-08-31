import React, { Component } from 'react'
import { gettingUserById } from 'APP/src/reducers/actions/users'
import { Row, Col, Button, FormControl, ControlLabel, Image } from 'react-bootstrap'
import blankAvatar from 'APP/src/components/dashboard/blank-avatar.png'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class UserDetailPage extends Component {
  componentWillMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }

  render() {
    const saved = null
    const {match} = this.props
    const user = this.props.user ? this.props.user._source : null
    let paddingTop = match.path === '/users/:id' ? '60px' : '0'
    return (
      <Row className='JobInfo Dashboard__content--white' style={{paddingTop}}>
        {user &&
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className='JobInfo--header'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Image
                  className='user-avatar'
                  circle
                  responsive
                  src={user.image_url ? user.image_url : blankAvatar}
                  alt={`${user.first_name}'s' avatar`}
                />
                <Col className='header-left' xs={12} sm={6} md={6} lg={6}>
                  <h5 className='JobInfo--header-employer'>{user.first_name} {user.last_name}</h5>
                  <p className='JobInfo--header-location'>{`${user.location}`}</p>
                </Col>
                <Col className='header-right' xs={12} sm={6} md={3} mdOffset={3} lg={3} lgOffset={3}>
                  <h5 className='JobInfo--header-payrate'>
                    {user.personal_site}
                  </h5>
                  {user.employment_types && user.employment_types.map((type, i) => (
                    <span key={i} className='JobInfo--header-type'>{type}</span>
                  ))}
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
                      <h2>Projects</h2>
                      <ul>
                        {user.projects && user.projects.map((project, i) => (
                          <li key={i} className='JobInfo--header-type'>
                            <h3>{project.title}</h3>
                            <p className='JobCard-skills'>{project.skills.map(skill => skill.title).join(', ')}</p>
                            <h5>Project Link</h5>
                            <p>{project.external_link}</p>
                            <h5>Description</h5>
                            <p>{project.description}</p>
                            <h5>Learning Point</h5>
                            <p>{project.learning_point}</p>
                            <h5>Pain Point</h5>
                            <p>{project.pain_point}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Col>
                  <Col className='JobInfo--sidebar' xs={12} sm={5} md={4} lg={4}>
                    {user.resume_url &&
                      <a href={user.resume_url} alt={`${user.first_name}'s' resume`}>
                      {user.first_name}'s Resume</a>
                    }
                    <Button
                      className='btn-oval btn-oval__black'
                      onClick={!saved ? this.saveJob : this.unsaveJob}
                    >
                      {!saved ? 'SAVE' : 'UNSAVE'}
                    </Button>
                    <div className='JobInfo--subscribe-container'>
                      <h4>
                        Reach out to this user!
                      </h4>
                      <form>
                        <ControlLabel srOnly>Email</ControlLabel>
                        <FormControl
                          type='email'
                          placeholder='EMAIL'
                          onChange={this.handleChange}
                        />
                        <Button type='submit' className='JobInfo--subscribe-button'>
                          SEND
                        </Button>
                      </form>
                    </div>
                  </Col>
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
      }
      </Row>
    )
  }
}

// {skills && skills.map((skill, i) => (
//   <span key={i} className='skill-chip'>{skill}</span>
// ))}

UserDetailPage.propTypes = {
  history: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.users.selected,
})

const mapDispatchToProps = dispatch => ({
  getUser: job_id => dispatch(gettingUserById(job_id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailPage)
