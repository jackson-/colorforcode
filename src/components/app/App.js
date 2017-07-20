import React, { Component } from 'react'
import { Grid, Nav, Glyphicon, NavItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import MainNav from './Navbar'
import Home from '../home/Home'
import ProjectsPage from '../projects/ProjectsPage'
import About from '../about/About'
import RegisterForm from '../auth/RegisterForm'
import LoginForm from '../auth/LoginForm'
import JobDetailPage from '../jobs/JobDetailPage'
import Dashboard from '../dashboard/EmployerDashboard'
import ProjectCreate from '../projects/CreateProjectForm'
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

  render () {
    const dashMenuStyle = {
      padding: this.state.padding,
      height: this.state.height,
      opacity: this.state.opacity,
      marginBottom: this.state.marginBottom
    }
    console.log(this.props)
    return (
      <Router>
        <div>
          <MainNav
            user={this.props.user}
            logOut={this.props.logOut()}
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
              <LinkContainer
                hidden={this.state.showDashMenu}
                to='/dashboard/post-new-job'
                className='Dashboard__nav-item'
              >
                <NavItem style={{opacity: this.state.opacity}}>
                  <Glyphicon glyph='plus-sign' /> Post New Job
                </NavItem>
              </LinkContainer>
              <LinkContainer
                hidden={this.state.showDashMenu}
                to='/dashboard/manage-jobs'
                className='Dashboard__nav-item'
              >
                <NavItem style={{opacity: this.state.opacity}}>
                  <Glyphicon glyph='list-alt' /> Manage Jobs
                </NavItem>
              </LinkContainer>
              <LinkContainer
                to='/dashboard/edit-profile'
                className='Dashboard__nav-item'
              >
                <NavItem style={{opacity: this.state.opacity}}>
                  <Glyphicon glyph='user' /> Edit Profile
                </NavItem>
              </LinkContainer>
            </Nav>
          }
          <Grid fluid className='App'>
            <Route exact strict path='/' component={Home} />
            <Route exact path='/about' component={About} />
            <Route exact path='/register' component={RegisterForm} />
            <Route exact path='/login' component={LoginForm} />
            <Route exact path='/dashboard/post-new-job' component={Dashboard} />
            <Route exact path='/dashboard/manage-jobs' component={Dashboard} />
            <Route exact path='/dashboard/edit-profile' component={Dashboard} />
            <Route exact path='/jobs/:id' component={JobDetailPage} />
            <Route exact path='/projects' component={ProjectsPage} />
            <Route exact path='/projects/create' component={ProjectCreate} />
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

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  logOut: () => event => {
    event.preventDefault()
    dispatch(logout())
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
