import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, NavbarBrand, Nav,
         NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
const onlyOneActiveMatch = (match, location) => {
  if (match) return location.pathname === match.path
  else return false
}

const NavBar = props => (
  <Navbar style={props.style} fixedTop collapseOnSelect>
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
          props.user
            ? <LinkContainer to='#' eventKey={3} className='dropdown-hover'>
                <NavDropdown title='Account' id='account-dropdown'>
                  <LinkContainer to='/dashboard' eventKey={3.1}>
                    <MenuItem>Dashboard</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='#' eventKey={3.2} onClick={props.logoutUser(props.history)}>
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
          <NavItem><span className='btn-oval'>Post a job</span></NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

const mapStateToProps = state => ({ history: state.history })

export default connect(mapStateToProps)(NavBar)
