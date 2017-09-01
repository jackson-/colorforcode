import React from 'react'
import { Row } from 'react-bootstrap'
import './LoadingSpinner.css'

const LoadingSpinner = ({top}) => {
  return (
    <Row className='loader-bg fadeIn animated'>
      <div className='loader' style={{top}} />
    </Row>
  )
}

export default LoadingSpinner
