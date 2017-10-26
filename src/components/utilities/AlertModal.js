import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Alert, Glyphicon, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { dismissAlert } from 'APP/src/reducers/actions/alert'
import './AlertModal.css'

class AlertModal extends Component {
  onHide = () => {
    const {next, history, dismissAlert} = this.props
    dismissAlert()
    if (next) history.push(next)
  }

  handleClick = type => event => {
    const {history, dismissAlert} = this.props
    dismissAlert()
    history.push(`/${type}`)
  }

  render () {
    const {body, footer, title, show, style} = this.props
    const glyph = style === 'success' ? 'check' : 'exclamation-sign'
    return (
      <Modal
        className={`AlertModal`}
        show={show}
        onHide={this.onHide}
      >
        <Modal.Header closeButton className={`modal-${style}`}>
          <Modal.Title className='AlertModal__title'>
            <Glyphicon glyph={glyph} /> {title}
          </Modal.Title>
        </Modal.Header>
        <Alert className='AlertModal__alert' bsStyle={style}>
          <p>{body}</p>
        </Alert>
        { // if users try to access private routes, an alert is dispatched
          // with 'footer: true' so user select login or register
          footer &&
          <Modal.Footer className={`modal-${style}`}>
            <Button
              bsSize='large'
              onClick={this.handleClick('login')}
              className={`btn-modal btn-modal-${style}`}
            >
              Login
            </Button>
            <Button
              bsSize='large'
              onClick={this.handleClick('register')}
              className={`btn-modal btn-modal-${style}`}
            >
              Register
            </Button>
          </Modal.Footer>
        }
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
  footer: PropTypes.bool,
  next: PropTypes.string,
  style: PropTypes.string, // success, warning, danger etc (Bootstrap)
  show: PropTypes.bool,
  history: PropTypes.object,
  dismissAlert: PropTypes.func
}

export default withRouter(connect(null, mapDispatchToProps)(AlertModal))
