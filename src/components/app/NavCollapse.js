import React, { Component } from 'react'
import { Nav, NavItem, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class NavCollapse extends Component {
  render () {
    const {state, isEmployer, collapse} = this.props
    const dashMenuStyle = {
      padding: state.padding,
      height: state.showDashMenu ? (isEmployer ? '215px' : '300px') : '0'
      // marginBottom: state.marginBottom
      // opacity: state.opacity,
      // display: state.display
    }
    const dashMobileMenu = {
      employer: [
        {to: '/dashboard/post-new-job', glyph: 'plus-sign', text: 'Post New Job'},
        {to: '/dashboard/manage-jobs', glyph: 'list-alt', text: 'Manage Jobs'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'}
      ],
      applicant: [
        {to: '/dashboard/applications', glyph: 'list-alt', text: 'Applications'},
        {to: '/dashboard/edit-profile', glyph: 'user', text: 'Edit Profile'},
        {to: '/dashboard/saved-jobs', glyph: 'heart', text: 'Saved Jobs'},
        {to: '/dashboard/add-project', glyph: 'plus-sign', text: 'Add Project'},
        {to: '/dashboard/projects', glyph: 'briefcase', text: 'Projects'}
      ]
    }
    return (
      <Nav
        className='Dashboard-menu-collapse'
        onSelect={collapse}
        stacked
        style={dashMenuStyle}
      >
        {
          isEmployer &&
            dashMobileMenu.employer.map((link, i) => (
              <LinkContainer
                style={{transform: state.transform}}
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
          !isEmployer &&
            dashMobileMenu.applicant.map((link, i) => (
              <LinkContainer
                style={{
                  transition: 'all .75s cubic-bezier(.17,.67,.83,.67)',
                  opacity: state.opacity,
                  transform: state.transform
                }}
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
}

NavCollapse.propTypes = {
  isEmployer: PropTypes.bool,
  state: PropTypes.object,
  collapse: PropTypes.func
}

export default NavCollapse
