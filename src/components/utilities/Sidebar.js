import React from 'react'
import PropTypes from 'prop-types'
import './Sidebar.css'

const Sidebar = ({content, header}) => (
  <div className='Sidebar'>
    <h3 className='Sidebar__header'>{header}</h3>
    {content}
  </div>
)

Sidebar.propTypes = {
  header: PropTypes.string,
  content: PropTypes.node
}

export default Sidebar
