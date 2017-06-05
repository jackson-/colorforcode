import React from 'react'
import { Alert } from 'react-bootstrap'

const Card = ({ number, exp_month, exp_year, cvc, token }) => (
  <Alert bsStyle="info">
    <h5>{ number }</h5>
    <p className="exp-cvc">
      <span>{ exp_month }/{ exp_year }</span>
      <span>{ cvc }</span>
    </p>
    <em>{ token }</em>
  </Alert>
)

export default Card
