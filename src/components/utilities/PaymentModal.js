import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal, Alert, Glyphicon, Button, FormGroup, FormControl, Form
} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import './AlertModal.css'
import {coupons} from 'APP/src/coupons'

class PaymentModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coupon: '',
      amount: 0,
      title: '',
      body: '',
      footer: '',
      style: '',
      error: ''
    }
  }

  componentDidMount () {
    const {jobs} = this.props
    if (jobs.length === 0) {
      this.setState({
        title: 'Error',
        body: `You haven't created any jobs yet.`
      })
    } else {
      const amount = this.calculatePrice(jobs, null)
      this.setState({
        amount,
        title: 'Checkout',
        body: 'Creating jobs',
        style: 'success'
      })
    }
  }

  handleHide = () => {
    const {next, history, dismissAlert} = this.props
    dismissAlert()
    if (next) history.push(next)
  }

  handleChange = type => event => {
    const {value} = event.target
    this.setState({[type]: value})
  }

  validateCode = () => {
    const coupon = coupons[this.state.coupon]
    const {jobs} = this.props
    if (coupon) {
      const amount = this.calculatePrice(jobs, coupon)
      this.setState({amount})
    } else {
      this.setState({error: 'Invalid coupon code'})
    }
  }

  calculatePrice = (jobs, coupon) => {
    let {amount} = this.state
    if (jobs.length >= 5) {
      amount = jobs.length * 225
    } else if (jobs.length >= 2 && jobs.length <= 4) {
      amount = jobs.length * 270
    } else if (jobs.length === 1) {
      amount = 300
    }
    if (coupon) {
      if (coupon.title === 'wemustlikeyou') {
        amount = 0
      } else if (coupon.type === 'amount') {
        amount = (amount - coupon.amount) > 0 ? amount - coupon.amount : 0
      } else {
        amount = (amount * coupon.percent) > 0 ? amount * coupon.percent : 0
      }
    }
    return amount
  }

  render () {
    const {show, style, jobs, skills, handleSubmit, applyCode} = this.props
    const {amount, title, body} = this.state
    const glyph = style === 'success' ? 'check' : 'exclamation-sign'
    return (
      <Modal
        className={`AlertModal`}
        show={show}
        onHide={this.handleHide}
      >
        <Modal.Header closeButton className={`modal-${style}`}>
          <Modal.Title className='AlertModal__title'>
            <Glyphicon glyph={glyph} /> {title}
          </Modal.Title>
        </Modal.Header>
        <Alert className='AlertModal__alert' bsStyle={style}>
          <p>{body}</p>
          <ul>
            {jobs && jobs.map((job, i) => <li key={i}>{job.title}</li>)}
          </ul>
          <Form inline className='AlertModal__form'>
            <FormGroup controlId={'promo-code'} >
              <FormControl
                onChange={this.handleChange}
                value={this.state.coupon}
                placeholder='Enter promo code'
              />
            </FormGroup>
            <Button
              className={`btn-modal btn-modal-${style} btn-inline`}
              onClick={applyCode}
            >
              Apply code
            </Button>
          </Form>
          <p className='AlertModal__body-text'>{`Your total is $${amount}`}</p>
          <Button
            bsSize='lg'
            className={`btn-modal btn-modal-${style}`}
            onClick={handleSubmit(jobs, skills)}
          >
            Create jobs
          </Button>
        </Alert>
      </Modal>
    )
  }
}

PaymentModal.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object),
  skills: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  body: PropTypes.string,
  footer: PropTypes.bool,
  next: PropTypes.string,
  style: PropTypes.string, // success, warning, danger etc (Bootstrap)
  show: PropTypes.bool,
  history: PropTypes.object,
  dismissAlert: PropTypes.func,
  handleSubmit: PropTypes.func,
  applyCode: PropTypes.func
}

export default withRouter(PaymentModal)
