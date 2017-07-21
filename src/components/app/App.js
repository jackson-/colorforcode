import React, { Component } from 'react'
import { Grid, Nav, Glyphicon, NavItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import MainNav from './Navbar'
import Home from '../home/Home'
import About from '../about/About'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'
import JobDetailPage from '../jobs/JobDetailPage'
import Dashboard from '../dashboard/Dashboard'
import './App.css'
import { logout } from '../../reducers/actions/users'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showDashMenu: false,
      opacity: 0,
      height: 0,
      padding: 0,
      marginBottom: 0
    }
  }

  toggleDashMenu = event => {
    if (event) event.preventDefault()
    this.setState({
      showDashMenu: true,
      height: this.state.height === '215px' ? '0' : '215px',
      padding: this.state.padding === '75px 0 10px 0' ? '0' : '75px 0 10px 0',
      opacity: this.state.opacity === 0 ? 1 : 0,
      marginBottom: this.state.marginBottom === '-60px' ? 0 : '-60px'
    })
  }

  isNotDashRoute = () => {
    const location = this.props.location
      ? this.props.location.pathname.split('/')
      : []
    return location.includes('dashboard') === false
  }

  logOut = history => event => {
    event.preventDefault()
    this.props.logOut(history)
  }

  render () {
    const dashMenuStyle = {
      padding: this.state.padding,
      height: this.state.height,
      opacity: this.state.opacity,
      marginBottom: this.state.marginBottom
    }

    const dashMobileMenu = {
      employer: [
        {to: '/dashboard/post-new-job', glyph: 'plus-sign', text: 'Post New Job'},
        {to: '/dashboard/manage-jobs', glyph: 'list-alt', text: 'Manage Jobs'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'}
      ],
      applicant: [
        {to: '/dashboard/applications', glyph: 'list-alt', text: 'Applications'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'},
        {to: '/dashboard/saved-jobs', glyph: 'heart', text: 'Saved Jobs'},
        {to: '/dashboard/projects', glyph: 'briefcase', text: 'Projects'}
      ]
    }

    const {user} = this.props

    return (
      <Router>
        <div>
          <MainNav
            user={this.props.user}
            logOut={this.logOut}
            toggleDashMenu={this.toggleDashMenu}
            isNotDashRoute={this.isNotDashRoute()}
          />
          {
            <Nav
              className='Dashboard-menu-collapse'
              style={dashMenuStyle}
              stacked
              onSelect={this.toggleDashMenu}
            >
              {
                user && user.is_employer &&
                  dashMobileMenu.employer.map((link, i) => (
                    <LinkContainer
                      hidden={this.state.showDashMenu}
                      to={link.to}
                      className='Dashboard__nav-item'
                      key={i}
                    >
                      <NavItem style={{opacity: this.state.opacity}}>
                        <Glyphicon glyph={link.glyph} /> {link.text}
                      </NavItem>
                    </LinkContainer>
                  ))
              }
              {
                user && !user.is_employer &&
                  dashMobileMenu.applicant.map((link, i) => (
                    <LinkContainer
                      hidden={this.state.showDashMenu}
                      to={link.to}
                      className='Dashboard__nav-item'
                      key={i}
                    >
                      <NavItem style={{opacity: this.state.opacity}}>
                        <Glyphicon glyph={link.glyph} /> {link.text}
                      </NavItem>
                    </LinkContainer>
                  ))
              }
            </Nav>
          }
          <Grid fluid className='App'>
            {/* PUBLIC ROUTES */}
            <Route exact strict path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/register' component={RegisterForm} />
            <Route path='/login' component={LoginForm} />
            <Route path='/jobs/:id' component={JobDetailPage} />
            {/* EMPLOYER DASHBOARD ROUTES */}
            <Route path='/dashboard/post-new-job' component={Dashboard} />
            <Route path='/dashboard/manage-jobs' component={Dashboard} />
            <Route path='/dashboard/jobs/:id' component={Dashboard} />
            {/* APPLICANT DASHBOARD ROUTES */}
            <Route path='/dashboard/saved-jobs' component={Dashboard} />
            <Route path='/dashboard/applications' component={Dashboard} />
            <Route path='/dashboard/saved-jobs/:id' component={Dashboard} />
            <Route path='/dashboard/projects' component={Dashboard} />
            <Route path='/dashboard/projects/create' component={Dashboard} />
            <Route path='/dashboard/edit-profile' component={Dashboard} />
          </Grid>
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  logOut: PropTypes.func.isRequired
}

const mapStateToProps = state => ({ user: state.users.currentUser })
const mapDispatchToProps = dispatch => ({ logOut: (history) => dispatch(logout(history)) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
