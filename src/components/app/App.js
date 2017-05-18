import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { logout } from '../../reducers/actions/users'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
// const onlyOneActiveMatch = (match, location) => {
//   if (match) return location.pathname === match.path
// }

const App = props => (
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
          <LinkContainer to='/'>
            <NavItem>Home</NavItem>
          </LinkContainer>
          <LinkContainer to='/about'>
            <NavItem>About</NavItem>
          </LinkContainer>
          {
            !props.user
              ? <div>
                  <LinkContainer to='/login'>
                    <NavItem>Login</NavItem>
                  </LinkContainer>

                  <LinkContainer to='/register'>
                    <NavItem>Register</NavItem>
                  </LinkContainer>

                  <LinkContainer to='/employer/login'>
                    <NavItem>Employer Login</NavItem>
                  </LinkContainer>

                  <LinkContainer to='/employer/register'>
                    <NavItem>Employer Register</NavItem>
                  </LinkContainer>

                </div>
              : <div>
                  <NavItem>Logout</NavItem>

                  <LinkContainer to='/profile'>
                    <NavItem>Profile</NavItem>
                  </LinkContainer>

                  <LinkContainer to='/account'>
                    <NavItem>Account</NavItem>
                  </LinkContainer>
                </div>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Grid fluid className='App'>
      { props.children && React.cloneElement(props.children, props) }
    </Grid>
  </div>
)

const mapStateToProps = state => ({
  user: state.users.current
})

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logout())
})

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default withRouter(AppContainer)
