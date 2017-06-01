import React from 'react'

const CardLogos = props => (
  <ul className="credit-card-list clearfix">
    <li><i data-brand="visa" className="fa fa-cc-visa cc-logo"></i></li>
    <li><i data-brand="amex" className="fa fa-cc-amex cc-logo"></i></li>
    <li><i data-brand="mastercard" className="fa fa-cc-mastercard cc-logo"></i></li>
    <li><i data-brand="jcb" className="fa fa-cc-jcb cc-logo"></i></li>
    <li><i data-brand="discover" className="fa fa-cc-discover cc-logo"></i></li>
    <li><i data-brand="dinersclub" className="fa fa-cc-diners-club cc-logo"></i></li>
  </ul>
);

export default CardLogos
