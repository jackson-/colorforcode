import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Navbar, NavbarBrand, Nav,
         NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/hireblack-logo-no-border.svg'

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
          <NavDropdown eventKey={3} title='Login' id='login-dropdown'>
            <LinkContainer eventKey={3.1} to='/employers/login'>
              <MenuItem>Employers</MenuItem>
            </LinkContainer>
            <LinkContainer eventKey={3.2} to='/login'>
              <MenuItem>Job Seekers</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown eventKey={4} title='Register' id='registration-dropdown'>
            <LinkContainer eventKey={4.1} to='/employers/register'>
              <MenuItem>Employers</MenuItem>
            </LinkContainer>
            <LinkContainer eventKey={4.2} to='/register'>
              <MenuItem>Job Seekers</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Grid fluid className='App'>
      { props.children && React.cloneElement(props.children, props) }
    </Grid>
  </div>
)

export default App
