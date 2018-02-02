import React from 'react'
import ReactDOM from 'react-dom'
import ReferralCodes from './ReferralCodes'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<ReferralCodes />, div)
})
