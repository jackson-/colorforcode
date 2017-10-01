import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Alert, Glyphicon, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import './PaymentModal.css'
import {coupons} from 'APP/src/coupons'

class PaymentModal extends Component {

  constructor (props) {
    super(props)
    this.state = {
      coupon: null,
      amount:0,
      title:'',
      body:'',
      footer:'',
      style:'',
      error:null,
    }
  }

  // componentWillMount(){
  //   console.log('WILLL', this.props.jobs)
  // }

  componentDidMount(){
    const {jobs} = this.props
    if(jobs.length === 0){
      this.setState({title:"Error",
        body:'You must submit at least one job before checking out',
      })
    } else {
      const amount = this.calculatePrice(jobs, null)
      this.setState({amount, modal_title:"Checkout",
        body:"You're total price will be $",
        style:'success'
      })
    }
  }

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

  handleChange = type => event => {
    const {value} = event.target
    this.setState({[type]: value})
  }

  validateCoupon = () => {
    const state = this.state
    const coupon = coupons[this.state.coupon]
    const {jobs} = this.props
    if(coupon){
      const amount = this.calculatePrice(jobs, coupon)
      this.setState({amount})
    } else{
      this.setState({error:'Invalid coupon code'})
    }
  }

  calculatePrice(jobs, coupon){
    let {amount} = this.state
    if (jobs.length >= 5) {
      amount = jobs.length * 225
    } else if (jobs.length >= 2 && jobs.length <= 4) {
      amount = jobs.length * 270
    } else if (jobs.length === 1) {
      amount = 300
    }
    if(coupon){
      if(coupon.title === 'wemustlikeyou'){
        amount = 0
      } else if(coupon.type === "amount"){
        amount = (amount - coupon.amount) > 0 ? amount - coupon.amount : 0;
      } else {
        amount = (amount * coupon.percent) > 0 ? amount * coupon.percent : 0;
      }
    }
    return amount
  }

  render () {
    const {show, style, jobs} = this.props
    const {amount, title, body, footer} = this.state
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
          <h2>{body + amount}</h2>
          {jobs && jobs.map((job, i) => {
            return (
              <p key={i}>
                {job.title}
              </p>
            )
          })}
          <input onChange={this.handleChange("coupon")} type='text' placeholder="Coupon Code" name="coupon"/>
          <Button
            bsSize='large'
            onClick={this.validateCoupon}
            className={`btn-modal btn-modal-${style}`}
          >
            Apply
          </Button>
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
