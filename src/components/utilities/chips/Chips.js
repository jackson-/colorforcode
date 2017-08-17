import React from 'react'
import PropTypes from 'prop-types'
import './Chips.css'

const Chips = ({words, type, align, justify}) => (
  <div className='chip-wrapper' style={{alignItems: align, justifyContent: justify}}>
    {
      words.map((word, i) => (
        <span key={i} className={`chip-${type}`}>
          {word}
        </span>
      ))
    }
  </div>
)

Chips.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string),
  align: PropTypes.string, // any of the align-items flexbox property options
  justify: PropTypes.string, // any of the justify-content flexbox property options
  type: PropTypes.string // either round or square, used to interpolate className
}

export default Chips
