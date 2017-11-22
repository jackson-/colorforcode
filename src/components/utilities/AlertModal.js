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

  handleClick = ({action, next}) => event => {
    event.preventDefault()
    const {history, dismissAlert} = this.props
    action && action()
    dismissAlert()
    // if users try to access private routes, an alert is dispatched
    // with 'footer: true' so users select login or register.
    // After they are logged in, they're sent back to do job task
    // they'd attempted pre-login (job detail or post job form).

    // if they click apply to job and are logged in,
    // an alert pops up that confirms they're ready
    // for us to email the employer about them or
    // if they'd like to saves the job and check their profile
    next && history.push(next)
  }

  render () {
    const {title, show, style, body, footer, footerActions} = this.props
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
          <div dangerouslySetInnerHTML={{__html: body}} />
        </Alert>
        { // if users try to access private routes, an alert is dispatched
          // with 'footer: true' so users select login or register.
          // After they are logged in, they're sent back to do job task
          // they'd attempted pre-login (job detail or post job form)
          footer &&
          <Modal.Footer className={`modal-${style}`}>
            {
              footerActions.map((footerAction, i) => (
                <Button
                  key={i}
                  bsSize='large'
                  onClick={this.handleClick(footerAction)}
                  className={`btn-modal btn-modal-${style}`}
                >
                  {footerAction.text}
                </Button>
              ))
            }
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
  footerActions: PropTypes.arrayOf(PropTypes.object), // footerActions have keys: 'text', 'next' and 'action'
  next: PropTypes.string,
  style: PropTypes.string, // success, warning, danger etc (Bootstrap)
  show: PropTypes.bool,
  history: PropTypes.object,
  dismissAlert: PropTypes.func
}

export default withRouter(connect(null, mapDispatchToProps)(AlertModal))
