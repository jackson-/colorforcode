import React, { Component } from 'react'
import { gettingUserById } from 'APP/src/reducers/actions/users'
import { Row, Col, Image, Glyphicon } from 'react-bootstrap'
import blankAvatar from 'APP/src/components/dashboard/blank-avatar.png'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconBar from '../utilities/icons/IconBar'
import TwitterIcon from '../utilities/icons/TwitterIcon'
import LinkIcon from '../utilities/icons/LinkIcon'
import GithubIcon from '../utilities/icons/GithubIcon'
import LinkedInIcon from '../utilities/icons/LinkedInIcon'
import PortfolioCard from './PortfolioCard'
import ProjectModal from './ProjectModal'
import Project from './Project'
import './UserProfile.css'

class UserProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      opacity: '0',
      showModal: false,
      currentProject: {}
    }
  }

  componentDidMount () {
    const {user, fetchingUser, match} = this.props
    const {id} = match.params
  }

  componentWillReceiveProps () {
    const {user, fetchingUser, match} = this.props
    const {id} = match.params
  }

  componentWillMount () {
    const {user, fetchingUser, match, getUser} = this.props
    const {id} = match.params
    if (!fetchingUser) {
      if (!user || user.id !== Number(id)) {
        getUser(id)
      }
    }
  }

  handleOnLoad = () => {
    this.setState({opacity: '1'})
  }

  handleClickCard = project => () => {
    this.setState({
      showModal: true,
      currentProject: project
    })
  }

  handleDismiss = () => {
    this.setState({showModal: false})
  }

  render () {
    let {match, user} = this.props
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
    const {opacity, showModal, currentProject} = this.state
    // below we're fixing the unnecessary padding when this component
    // is rendered by the applicant dashboard
    let paddingTop = match.path === '/users/:id' ? '60px' : '0'
    console.log("USER", user)
    return (
      <Row className='UserDetail fadeIn animated' style={{paddingTop}}>
        {
          user &&
          <Col xs={12} sm={12} md={12} lg={12}>
            <Row className='UserDetail__header'>
              <Col xs={12} sm={12} md={2} lg={2}>
                <div className='header-avatar'>
                  <Image
                    className='UserDetail__header-avatar'
                    circle
                    style={{opacity}}
                    responsive
                    onLoad={this.handleOnLoad}
                    src={user.image_url ? user.image_url : blankAvatar}
                    alt={`${user.first_name}'s avatar`}
                  />
                </div>
              </Col>
              <Col className='header-left-container' xs={12} sm={8} md={7} lg={7}>
                <div className='header-left'>
                  <h1 className='UserDetail__header-name'>
                    {`${user.first_name} ${user.last_name}`}
                  </h1>
                  <p className='UserDetail__header-headline'>
                    {user.headline || 'This is your headline, a short elevator pitch highlighting a key goal or accomplishment, written in your voice so your personality is front and center.'}
                  </p>
                </div>
              </Col>
              <Col className='header-right-container' xs={12} sm={4} md={3} lg={3}>
                <div className='header-right'>
                  <p className='UserDetail__header-title'>
                    {user.title}
                  </p>
                  <p className='UserDetail__header-location'>
                    <Glyphicon glyph='map-marker' /> {`${user.location}`}
                  </p>
                  <IconBar icons={icons} color='white' />
                </div>
              </Col>
            </Row>
            <Row className='UserDetail__body'>
              <div className='container__flex'>
                <Col className='UserDetail__body-section' xs={12} sm={9} md={8} lg={8}>
                  <div className='portfolio'>
                    <h2 className='UserDetail__body-header'>
                      Portfolio
                    </h2>
                    <Row>
                      {
                        user.projects && user.projects.map((p, i) => {
                          const skills = p.skills.map(s => s.title)
                          return (
                            <PortfolioCard
                              key={i}
                              handleOnLoad={this.handleOnLoad}
                              handleClick={this.handleClickCard(p)}
                              src={p.screenshot || blankAvatar}
                              title={p.title}
                              opacity={opacity}
                              skills={skills}
                            />
                          )
                        })
                      }
                      {
                        showModal &&
                        <ProjectModal
                          show={showModal}
                          title={currentProject.title}
                          body={
                            <Project
                              project={currentProject}
                              handleOnLoad={this.handleOnLoad}
                            />
                          }
                          urls={{
                            github: currentProject.repo,
                            website: currentProject.site
                          }}
                          dismissProject={this.handleDismiss}
                        />
                      }
                    </Row>
                  </div>
                </Col>
                <Col className='UserDetail__body-section' xs={12} sm={3} md={4} lg={4}>
                  <div className='summary'>
                    <h2 className='UserDetail__body-header text-white'>Bio</h2>
                    {
                      user.summary
                        ? user.summary
                        : (
                          <div>
                            <p className='summary-text'>
                              Expand on your tagline with a summary of your education or self-taught journey and experience.
                            </p>
                            <p className='summary-text'>
                              What are your specialities? What are you most interested in working on? What are you learning now?
                            </p>
                            <p className='summary-text'>
                              Give the employer a glimpse of who you are, both as a tech professional and as a human who cares about more than technology.
                            </p>
                          </div>
                        )
                    }
                    {
                      user.resume_url &&
                      <a href={user.resume_url} target='_blank' alt={`${user.first_name}'s' resume`}>
                        {`View ${user.first_name}'s Resume`}
                      </a>
                    }
                  </div>
                </Col>
              </div>
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
  user: PropTypes.any,
  padding: PropTypes.string,
  fetchingUser: PropTypes.bool
}

const mapStateToProps = state => ({
  user: state.users.selected,
  fetchingUser: state.users.fetchingUser
})

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(gettingUserById(id))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile))
