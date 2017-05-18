import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Navbar, NavbarBrand, Nav,
         NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logout } from '../../reducers/actions/users'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
const onlyOneActiveMatch = (match, location) => {
  if (match) return location.pathname === match.path
}

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
        <Nav pullRight>
          <LinkContainer eventKey={1} to='/' isActive={onlyOneActiveMatch}>
            <NavItem>Home</NavItem>
          </LinkContainer>
          <LinkContainer eventKey={2} to='/about' isActive={onlyOneActiveMatch}>
            <NavItem>About</NavItem>
          </LinkContainer>
          {
            props.user
              ? <NavDropdown eventKey={3} title='Account' id='account-dropdown'>
                  <LinkContainer to='/dashboard'>
                    <MenuItem eventKey={3.1}>Dashboard</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='#' onClick={props.logoutUser}>
                    <MenuItem eventKey={3.2}>Logout</MenuItem>
                  </LinkContainer>
                </NavDropdown>

              : <NavDropdown eventKey={3} title='Account' id='account-dropdown'>
                  <LinkContainer to='/login'>
                    <MenuItem eventKey={3.1}>Login</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <MenuItem eventKey={3.2}>Register</MenuItem>
                  </LinkContainer>
                </NavDropdown>
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
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
