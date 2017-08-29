import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Alert, Glyphicon } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { dismissAlert } from 'APP/src/reducers/actions/alert'

class AlertModal extends Component {

  onHide = () => {
    const {next, history, dismissAlert} = this.props
    dismissAlert()
    if (next) history.push(next)
  }

  render () {
    const {body, title, show, style} = this.props
    return (
      <Modal
        className='AlertModal'
        show={show}
        onHide={this.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title className='AlertModal__title'>
            <Glyphicon glyph='check' /> {title}
          </Modal.Title>
        </Modal.Header>
        <Alert className='AlertModal__alert' bsStyle={style}>
          <p>{body}</p>
          {alert.signed && <p><em>{alert.signed}</em></p>}
        </Alert>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dismissAlert: () => dispatch(dismissAlert())
})

AlertModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  next: PropTypes.string,
  style: PropTypes.string, // success, warning, danger etc (Bootstrap)
  show: PropTypes.bool,
  history: PropTypes.object,
  dismissAlert: PropTypes.func
}

export default withRouter(connect(null, mapDispatchToProps)(AlertModal))
