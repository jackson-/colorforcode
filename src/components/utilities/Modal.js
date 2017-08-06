import React from 'react'
import PropTypes from 'prop-types'
import './Sidebar.css'
import {Modal, Button} from 'react-bootstrap'

const MyModal = props => (
  <div className="static-modal">
  <Modal.Dialog>
    <Modal.Header>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {props.body}
    </Modal.Body>

    <Modal.Footer>
      <Button>Close</Button>
    </Modal.Footer>

  </Modal.Dialog>
  </div>
)

MyModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string
}

export default MyModal
