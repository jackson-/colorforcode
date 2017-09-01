import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, NavbarBrand, Nav, Glyphicon,
         Col, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'

const NavBar = props => (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <NavbarBrand>
        <LinkContainer to='/'>
          <img src={navLogo} alt='HireBlack logo' height='40px' width='40px' />
        </LinkContainer>
      </NavbarBrand>
      <Col
        xsHidden={!props.user}
        onClick={props.toggleDashMenu}
        className='Dashboard-menuToggle'
        xs={2} smHidden mdHidden lgHidden
      >
        <Glyphicon glyph='cog' />
      </Col>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav className='nav-links'>
        <LinkContainer eventKey={1} to='/' isActive={props.onlyOneActiveMatch}>
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer eventKey={2} to='/about' isActive={props.onlyOneActiveMatch}>
          <NavItem>About</NavItem>
        </LinkContainer>
        {
          props.user
            ? (
              <LinkContainer to='#' eventKey={3} className='dropdown-hover'>
                <NavDropdown title='Account' id='account-dropdown'>
                  <LinkContainer
                    to={
                      props.user.is_employer
                        ? '/dashboard/manage-jobs'
                        : '/dashboard/saved-jobs'
                    }
                    eventKey={3.1}
                  >
                    <MenuItem>Dashboard</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='#' eventKey={3.1} onClick={props.logOut()}>
                    <MenuItem >Logout</MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </LinkContainer>
            )

            : (
              <LinkContainer to='#' eventKey={3} className='dropdown-hover'>
                <NavDropdown title='Account' id='account-dropdown'>
                  <LinkContainer to='/login' eventKey={3.1}>
                    <MenuItem>Login</MenuItem>
                  </LinkContainer>
                  <LinkContainer to='/register' eventKey={3.2}>
                    <MenuItem>Register</MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </LinkContainer>
            )
        }
      </Nav>
      <Nav
        className='nav-button-container'
        pullRight
        style={{display: props.showPostJob(props.user)}}
      >
        <NavItem hidden={!props.user} onClick={() => props.history.push('/dashboard/post-new-job')}>
          <span className='btn-oval'>Post a job</span>
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

NavBar.propTypes = {
  user: PropTypes.any,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.object,
  toggleDashMenu: PropTypes.func.isRequired,
  showPostJob: PropTypes.func.isRequired,
  onlyOneActiveMatch: PropTypes.func.isRequired
}

export default NavBar
