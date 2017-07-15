import React from 'react'
import PropTypes from 'prop-types'
import './Sidebar.css'

const Sidebar = props => (
  <div className='Sidebar'>
    <h3 className='Sidebar__header'>{props.headerText}</h3>
    {props.content}
  </div>
)

Sidebar.propTypes = {
  headerText: PropTypes.string,
  content: PropTypes.node
}

export default Sidebar
