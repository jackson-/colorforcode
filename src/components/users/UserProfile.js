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

  constructor (props) {
    super(props)
    this.state = {
      opacity: '0',
      showModal: false
    }
  }

  componentWillMount () {
    const {id} = this.props.match.params
    if (!this.props.user) this.props.getUser(id)
  }

  handleOnLoad = () => {
    this.setState({opacity: '1'})
  }

  handleClick = () => {
    this.setState({showModal: !this.state.showModal})
  }

  render () {
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
    const {opacity} = this.state
    return (
      <Row className='UserDetail'>
        {user &&
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className='UserDetail__header'>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row>
                <Col xs={12} sm={12} md={2} lg={2}>
                  <Image
                    className='UserDetail__header-avatar'
                    circle
                    style={{opacity}}
                    responsive
                    onLoad={this.handleOnLoad}
                    src={user.image_url ? user.image_url : blankAvatar}
                    alt={`${user.first_name}'s avatar`}
                  />
                </Col>
                <Col className='header-left-container' xs={12} sm={8} md={7} lg={7}>
                  <div className='header-left'>
                    <h1 className='UserDetail__header-name'>
                      {`${user.first_name} ${user.last_name}`}
                    </h1>
                    <p className='UserDetail__header-headline'>
                      This is your headline, a short elevator pitch highlighting a key goal or accomplishment, written in your voice so your personality is front and center.
                    </p>
                  </div>
                </Col>
                <Col className='header-right-container' xs={12} sm={4} md={3} lg={3}>
                  <div className='header-right'>
                    <p className='UserDetail__header-title'>
                      {user.title}
                    </p>
                    <p className='UserDetail__header-location'>
                      <Glyphicon glyph='globe' /> {`${user.location}`}
                    </p>
                    <IconBar icons={icons} />
                  </div>
                </Col>
              </Row>
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
                      user.projects && user.projects.map(p => {
                        const skills = p.skills.map(s => s.title)
                        return (
                          <Col className='portfolio-card-container' xs={12} sm={6} md={6} lg={6}>
                            <button className='portfolio-card' onClick={this.handleClick}>
                              <div className='screenshot-placeholder'>
                                <Image
                                  style={{opacity}}
                                  className='UserDetail__project-screenshot'
                                  src={blankAvatar}
                                  alt={`Screenshot of ${p.title}`}
                                  responsive
                                  onLoad={this.handleOnLoad}
                                />
                              </div>
                              <div className='portfolio-card__text'>
                                <h4>{`${p.title}`}</h4>
                                <Chips
                                  words={skills}
                                  type={'round-bordered'}
                                  align={'center'}
                                  justify={'flex-start'}
                                  margin={'10px 0'}
                                />
                              </div>
                            </button>
                          </Col>
                        )
                      })
                    }
                  </Row>
                </div>
              </Col>
              <Col className='UserDetail__body-section' xs={12} sm={3} md={4} lg={4}>
                <div className='summary'>
                  <h2 className='UserDetail__body-header text-white'>Bio</h2>
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
  user: PropTypes.object,
  padding: PropTypes.string
}

const mapStateToProps = state => ({
  user: state.users.selected
})

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(gettingUserById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
