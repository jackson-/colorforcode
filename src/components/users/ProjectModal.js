import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

class ProjectModal extends Component {

  onHide = () => {
    const {dismissProject} = this.props
    dismissProject()
  }

  render () {
    const {body, title, show} = this.props
    return (
      <Modal className='ProjectModal' show={show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
          {body}
        </Modal.Header>
      </Modal>
    )
  }
}

ProjectModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  show: PropTypes.bool,
  dismissProject: PropTypes.func
}

export default ProjectModal
