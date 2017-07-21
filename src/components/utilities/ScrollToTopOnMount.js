import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTopOnMount extends Component {

  componentDidMount (prevProps) {
    window.scrollTo(0, 0)
  }

  render () {
    return <div></div>
  }
}

export default withRouter(ScrollToTopOnMount)
