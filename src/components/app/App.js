import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Navbar, NavbarBrand, Nav,
         NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../../reducers/actions/users'
import { receiveRouterState } from '../../reducers/actions/router'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
const onlyOneActiveMatch = (match, location) => {
  if (match) return location.pathname === match.path
  else return false
}

class App extends Component {
  componentWillReceiveProps(nextProps) {
    const {match, location, history} = nextProps
    this.props.passRouterState({match, location, history})
  }

  render () {
    let dashboard_url = null
    if(this.props.user){
      dashboard_url = this.props.user.employer ? "/dashboard/employer" : "/dashboard"
    }
    return (
      <div>
        <Navbar fixedTop collapseOnSelect>
          <Navbar.Header>
            <NavbarBrand>
              <LinkContainer to='/'>
                <img src={navLogo} alt='HireBlack logo' height='40px' width='40px'/>
              </LinkContainer>
            </NavbarBrand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer eventKey={1} to='/' isActive={onlyOneActiveMatch}>
                <NavItem>Home</NavItem>
              </LinkContainer>
              <LinkContainer eventKey={2} to='/about' isActive={onlyOneActiveMatch}>
                <NavItem>About</NavItem>
              </LinkContainer>
              {
                this.props.user
                  ? <LinkContainer to='#' eventKey={3} className='dropdown-hover'>
                      <NavDropdown title='Account' id='account-dropdown'>
                        <LinkContainer to={dashboard_url} eventKey={3.1}>
                          <MenuItem>Dashboard</MenuItem>
                        </LinkContainer>
                        <LinkContainer to='#' eventKey={3.2} onClick={this.props.logoutUser(this.props.history)}>
                          <MenuItem >Logout</MenuItem>
                        </LinkContainer>
                      </NavDropdown>
                    </LinkContainer>

                  : <LinkContainer to='#' eventKey={3} className='dropdown-hover'>
                      <NavDropdown title='Account' id='account-dropdown'>
                        <LinkContainer to='/login' eventKey={3.1}>
                          <MenuItem>Login</MenuItem>
                        </LinkContainer>
                        <LinkContainer to='/register' eventKey={3.2}>
                          <MenuItem>Register</MenuItem>
                        </LinkContainer>
                      </NavDropdown>
                    </LinkContainer>
              }
            </Nav>
            <Nav pullRight>
              <LinkContainer to='/post-new-job'>
                <NavItem>Post a job</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Grid fluid className='App'>
          { this.props.children && React.cloneElement(this.props.children, this.props) }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  logoutUser: (history) => () => dispatch(logout(history)),
  passRouterState: (routerState) => dispatch(receiveRouterState(routerState))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
