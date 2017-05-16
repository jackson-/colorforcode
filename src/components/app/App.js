import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
const onlyOneActiveMatch = (match, location) => {
  if (match) return location.pathname === match.path
}

const App = props => {
  console.log("PROPS", props)
  return(
  <div>
    <Navbar fixedTop collapseOnSelect>
      <Navbar.Header>
        <NavbarBrand>
          <NavLink to='/'>
            <img src={navLogo} alt='HireBlack logo' height='40px' width='40px'/>
          </NavLink>
        </NavbarBrand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem>
            <NavLink to='/' isActive={onlyOneActiveMatch}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to='/about' isActive={onlyOneActiveMatch}>About</NavLink>
          </NavItem>
          {!props.user
            ? <div>
            <NavItem><NavLink to='/login' isActive={onlyOneActiveMatch}>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/register' isActive={onlyOneActiveMatch}>Register
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/employer-login' isActive={onlyOneActiveMatch}>Employer Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/employer-register' isActive={onlyOneActiveMatch}>Employer Register
              </NavLink>
            </NavItem>
            </div>
            : <div>
            <a href='http://localhost:1337/api/users/logout' isActive={onlyOneActiveMatch}>Logout</a>
            <NavItem>
              <NavLink to='/profile' isActive={onlyOneActiveMatch}>Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/account' isActive={onlyOneActiveMatch}>Account
              </NavLink>
            </NavItem>
            </div>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Grid fluid className='App'>
      { props.children && React.cloneElement(props.children, props) }
    </Grid>
  </div>
)}

const mapStateToProps = state => ({
  user: state.users.current
})

const AppContainer = connect(mapStateToProps, null)(App)

export default withRouter(AppContainer)
