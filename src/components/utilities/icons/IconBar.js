import React from 'react'
import PropTypes from 'prop-types'
import './IconBar.css'

const SVGIconBar = ({icons}) => (
  <div className='icons'>
    {
      icons.map((icon, i) => (
        <a key={i} href={icon.url} target='_blank' className='icon'>
          <span className='sr-only'>{icon.text}</span>
          {icon.component}
        </a>
      ))
    }
  </div>
)

SVGIconBar.propTypes = {
  justify: PropTypes.string, // any of the justify-content flextbox property options
  icons: PropTypes.arrayOf(PropTypes.object)
  /* ^ icon objects should be structured as follows:
    {
      text: 'Github Profile', // sr-only description of icon link destination
      component: <GithubIcon />, // a React component with stripped down SVG code
      url: 'https://github.com/chloerice'
    }
*/
}

export default SVGIconBar
