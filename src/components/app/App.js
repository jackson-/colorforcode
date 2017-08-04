import React, { Component } from 'react'
import { Grid, Nav, Glyphicon, NavItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import MainNav from './Navbar'
import Home from '../home/Home'
import About from '../about/About'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'
import JobDetailPage from '../jobs/JobDetailPage'
import UserDetailPage from '../search/UserDetail'
import Dashboard from '../dashboard/Dashboard'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
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
    let height = this.props.user.is_employer ? '215px' : '300px'
    if (event) event.preventDefault()
    this.setState({
      showDashMenu: true,
      height: this.state.height === height ? '0' : height,
      padding: this.state.padding === '75px 0 10px 0' ? '0' : '75px 0 10px 0',
      opacity: this.state.opacity === 0 ? 1 : 0,
      marginBottom: this.state.marginBottom === '-60px' ? 0 : '-60px'
    })
  }

  showPostJob = user => {
    let display = !user || (user && user.is_employer)
      ? 'block'
      : 'none'
    return display
  }

  /*
    The .active class is being applied to '/' even when it isn't the current
    location.pathname because all other paths are its children. This method
    corrects for that.
  */
  onlyOneActiveMatch = (match, location) => {
    if (match) return location.pathname === match.path
    else return false
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
        {to: '/dashboard/add-project', glyph: 'plus-sign', text: 'Add Project'},
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
            onlyOneActiveMatch={this.onlyOneActiveMatch}
            showPostJob={this.showPostJob}
          />
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
            <ScrollToTopOnMount scroll={this.state.showDashMenu} />
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
          <Grid fluid className='App'>
            {/* PUBLIC ROUTES */}
            <Route exact strict path='/' component={Home} />
            <Route exact path='/about' component={About} />
            <Route exact path='/dashboard' component={() => {
              return user && user.is_employer
                ? <Redirect to='/dashboard/manage-jobs' />
                : <Redirect to='/dashboard/saved-jobs' />
            }} />
            <Route exact path='/register' component={() => {
              if (!user) return <RegisterForm />
              return <Redirect to='/dashboard' />
            }} />
            <Route exact path='/login' component={() => {
              if (!user) return <LoginForm />
              return <Redirect to='/dashboard' />
            }} />
            <Route exact path='/jobs/:id' component={JobDetailPage} />
            {/* PRIVATE ROUTES */}
            <Route exact path='/dashboard/:action' component={() => {
              if (!user) return <Redirect to='/login' />
              return <Dashboard />
            }} />
            <Route exact path='/dashboard/:action/:id' component={() => {
              if (!user) return <Redirect to='/login' />
              return <Dashboard />
            }} />
            <Route exact path='/jobs/:id' component={JobDetailPage} />
            <Route exact path='/login' component={LoginForm} />
            <Route exact path='/register' component={RegisterForm} />
            <Route exact path='/users/:id' component={UserDetailPage} />
          </Grid>
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired
}

const mapStateToProps = state => ({ user: state.users.currentUser })
const mapDispatchToProps = dispatch => ({ logOut: (history) => dispatch(logout(history)) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
