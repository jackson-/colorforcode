import React, { Component } from 'react';
import Payment from 'payment';
import { Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { getStripeToken } from './getStripeToken';
import Card from './Card'
import CardLogos from './CardLogos'
import './CreditCard.css'
import '../auth/Form.css'
const Stripe = window.Stripe;
Stripe.setPublishableKey('API_KEY');

export default class CreditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
    };
    this.setCardType = this.setCardType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetCard = this.resetCard.bind(this);
  }

  getScriptURL() {
    return 'https://js.stripe.com/v2/';
  }

  handleSubmit(event) {
    event.preventDefault();
    this.resetCard();

    const { refs } = this;
    const number = refs.number.value;
    const expiration = refs.expiration.value.split('/');
    const exp_month = parseInt(expiration[0], 10);
    const exp_year = parseInt(expiration[1], 10);
    const cvc = refs.cvc.value;
    const card = { number, exp_month, exp_year, cvc };

    getStripeToken(card)
    .then((token) => {
      card.token = token;
      this.setState(card);
    }).catch((error) => {
      alert(error);
    });
  }

  resetCard() {
    this.setState({
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null
    });
  }

  setCardType(event) {
    const type = Payment.fns.cardType(event.target.value);
    const cards = document.querySelectorAll('[data-brand]');

    [].forEach.call(cards, (element) => {
      if (element.getAttribute('data-brand') === type) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  componentDidMount() {
    const { number, expiration, cvc } = this.refs;
    Payment.formatCardNumber(number);
    Payment.formatCardExpiry(expiration);
    Payment.formatCardCVC(cvc);
  }

  render() {
    const { number, exp_month, exp_year, cvc, token } = this.state;

    return (
      <div className="CreditCardForm-body">
        <CardLogos />
        <FormGroup>
          <ControlLabel>Card Number</ControlLabel>
          <FormControl onKeyUp={this.setCardType} ref="number" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Expiration</ControlLabel>
          <FormGroup type='phone' ref="expiration">
            <FormControl className='exp-cvc' placeholder='MM/YYYY' />
          </FormGroup>
        </FormGroup>
        <FormGroup>
          <ControlLabel>CVC</ControlLabel>
          <FormControl type='phone' ref="cvc" className='exp-cvc' />
        </FormGroup>
        {
          number &&
          <Card
            number={number}
            exp_month={exp_month}
            exp_year={exp_year}
            cvc={cvc}
            token={token}
          />
        }
      </div>
    )
  }
}
