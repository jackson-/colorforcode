import React from 'react'
import { Nav, NavItem, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

const NavCollapse = props => {
  const {user, menu, style, state, collapse} = props
  return (
    <Nav
      className='Dashboard-menu-collapse'
      onSelect={collapse}
      style={style}
      stacked
    >
      {
        user && user.is_employer &&
          menu.employer.map((link, i) => (
            <LinkContainer
              style={{display: state.display}}
              to={link.to}
              className='Dashboard__nav-item'
              key={i}
            >
              <NavItem>
                <Glyphicon glyph={link.glyph} /> {link.text}
              </NavItem>
            </LinkContainer>
          ))
      }
      <ScrollToTopOnMount scroll={state.showDashMenu} />
      {
        user && !user.is_employer &&
          menu.applicant.map((link, i) => (
            <LinkContainer
              style={{display: state.display}}
              to={link.to}
              className='Dashboard__nav-item'
              key={i}
            >
              <NavItem>
                <Glyphicon glyph={link.glyph} /> {link.text}
              </NavItem>
            </LinkContainer>
          ))
      }
    </Nav>
  )
}

NavCollapse.propTypes = {
  display: PropTypes.string,
  menu: PropTypes.object,
  user: PropTypes.object,
  style: PropTypes.object,
  state: PropTypes.object,
  collapse: PropTypes.func
}

export default NavCollapse
