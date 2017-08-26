import React from 'react'
import { Col, Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Chips from '../utilities/chips/Chips'
import './UserProfile.css'

const PortfolioCard = ({opacity, title, src, skills, handleClick, handleOnLoad}) => (
  <Col className='portfolio-card-container' xs={12} sm={6} md={6} lg={6}>
    <button className='portfolio-card' onClick={handleClick}>
      <div className='screenshot-placeholder'>
        <Image
          style={{opacity}}
          className='UserDetail__project-screenshot'
          src={src}
          alt={`Screenshot of ${title}`}
          responsive
          onLoad={handleOnLoad}
        />
      </div>
      <div className='portfolio-card__text'>
        <h4>{title}</h4>
        <Chips
          words={skills}
          type={'round-bordered'}
          align={'center'}
          justify={'flex-start'}
          margin={'10px 0'}
        />
      </div>
    </button>
  </Col>
)

PortfolioCard.propTypes = {
  skills: PropTypes.array,
  handleClick: PropTypes.func,
  handleOnLoad: PropTypes.func,
  title: PropTypes.string,
  src: PropTypes.string,
  opacity: PropTypes.string
}

export default PortfolioCard
