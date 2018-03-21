import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Navbar, NavbarBrand, Nav, Glyphicon,
  Col, NavItem, MenuItem } from 'react-bootstrap'
import './App.css'
import navLogo from '../../img/c4c-logo-full-text.png'

const NavBar = ({
  user,
  logOut,
  showPostJob,
  handleClickPostJob,
  toggleDashMenu,
  receiveLocation,
  onlyOneActiveMatch,
}) => {
  let dashLocs = {
    manage: {
      pathname: '/dashboard/manage-jobs',
      search: '',
      hash: '',
      state: undefined,
      key: 'gmhpm7'
    },
    post: {
      pathname: '/dashboard/post-new-job',
      search: '',
      hash: '',
      state: undefined,
      key: 'mdohg8'
    }
  }

  const login = !user 
    ? (
      <LinkContainer to='/login' eventKey={3} isActive={onlyOneActiveMatch}>
        <MenuItem>Log in</MenuItem>
      </LinkContainer>
    )
    : null

  const signup = !user 
    ? (
      <LinkContainer to='/register' eventKey={4} isActive={onlyOneActiveMatch}>
        <MenuItem>Sign up</MenuItem>
      </LinkContainer>
    )
    : null

  const dashboard = user
    ? (
      <LinkContainer
        to={
          user.is_employer
            ? '/dashboard/manage-jobs'
            : '/dashboard/saved-jobs'
        }
        isActive={onlyOneActiveMatch}
        onSelect={receiveLocation(dashLocs.manage)}
        eventKey={3}
      >
        <MenuItem>Dashboard</MenuItem>
      </LinkContainer>
    )
    : null

  const logout = user
    ? (
      <LinkContainer to='#' eventKey={4} onClick={logOut()}>
        <MenuItem >Logout</MenuItem>
      </LinkContainer>
    )
    : null

  return (
    <Navbar fixedTop collapseOnSelect>
      <Navbar.Header>
        <NavbarBrand>
          <LinkContainer to='/'>
            <span>
              <img src={navLogo} alt='Color for Code' />
            </span>
          </LinkContainer>
        </NavbarBrand>
        <Col
          xsHidden={!user}
          onClick={toggleDashMenu}
          className='Dashboard-menuToggle'
          xs={2} smHidden mdHidden lgHidden
        >
          <Glyphicon glyph='cog' />
        </Col>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav
          pullRight
          style={{display: showPostJob(user)}}
        >
          <LinkContainer eventKey={1} to='/' isActive={onlyOneActiveMatch}>
            <NavItem>Home</NavItem>
          </LinkContainer>
          <LinkContainer eventKey={2} to='/about' isActive={onlyOneActiveMatch}>
            <NavItem>About</NavItem>
          </LinkContainer>
          {login}
          {signup}
          {dashboard}
          {logout}
          {/* <LinkContainer eventKey={5} to='/referral' isActive={onlyOneActiveMatch}>
            <NavItem>Referral Codes</NavItem>
          </LinkContainer> */}
          <LinkContainer
            className='nav-button-container'
            to='/dashboard/post-new-job'
            onSelect={handleClickPostJob}
          >
            <NavItem hidden={!user}>
              <span className='btn-oval'>Post a job</span>
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

NavBar.propTypes = {
  user: PropTypes.any,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object,
  toggleDashMenu: PropTypes.func.isRequired,
  showPostJob: PropTypes.func.isRequired,
  onlyOneActiveMatch: PropTypes.func.isRequired,
  receiveLocation: PropTypes.func,
  handleClickPostJob: PropTypes.func
}

export default withRouter(NavBar)
