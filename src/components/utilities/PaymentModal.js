import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Alert, Glyphicon, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { dismissAlert } from 'APP/src/reducers/actions/alert'
import './PaymentModal.css'

class PaymentModal extends Component {
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
    const {body, footer, title, show, style, jobs} = this.props
    const glyph = style === 'success' ? 'check' : 'exclamation-sign'
    return (
      <Modal
        className={`PaymentModal`}
        show={show}
        onHide={this.onHide}
      >
        <Modal.Header closeButton className={`modal-${style}`}>
          <Modal.Title className='PaymentModal__title'>
            <Glyphicon glyph={glyph} /> {title}
          </Modal.Title>
        </Modal.Header>
        <Alert className='PaymentModal__alert' bsStyle={style}>
          <h2>{body}</h2>
          {jobs && jobs.map((job, i) => {
            return (
              <p key={i}>
                {job.title}
              </p>
            )
          })
        }
        </Alert>
        { // if users try to access private routes, an alert is dispatched
          // with 'footer: true' so user can
          footer &&
          <Modal.Footer className={`modal-${style}`}>
            <Button
              bsSize='large'
              onClick={this.props.handleSubmit}
              className={`btn-modal btn-modal-${style}`}
            >
              Submit
            </Button>
          </Modal.Footer>
        }
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  // dismissAlert: () => dispatch(dismissAlert())
})

PaymentModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  footer: PropTypes.bool,
  next: PropTypes.string,
  style: PropTypes.string, // success, warning, danger etc (Bootstrap)
  show: PropTypes.bool,
  history: PropTypes.object,
  dismissAlert: PropTypes.func
}

export default withRouter(connect(null, mapDispatchToProps)(PaymentModal))
