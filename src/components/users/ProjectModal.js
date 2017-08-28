import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import IconBar from '../utilities/icons/IconBar'
import LinkIcon from '../utilities/icons/LinkIcon'
import GithubIcon from '../utilities/icons/GithubIcon'

import './Project.css'

class ProjectModal extends Component {

  onHide = () => {
    const {dismissProject} = this.props
    dismissProject()
  }

  render () {
    const {body, title, show, urls} = this.props
    const links = [
      {type: 'github', label: 'Github Profile', component: <GithubIcon />},
      {type: 'website', label: 'Webite', component: <LinkIcon />}
    ]
    let icons = []
    links.forEach(link => {
      if (urls[link.type]) {
        icons.push({
          text: link.label,
          component: link.component,
          url: urls[link.type]
        })
      }
    })
    return (
      <Modal
        className='ProjectModal'
        show={show}
        onHide={this.onHide}
        bsSize='large'
      >
        <Modal.Header closeButton>
          <Modal.Title className='ProjectModal__title'>
            <div className='container__flex'>
              {title}
              <IconBar icons={icons} color='green' />
            </div>
          </Modal.Title>
        </Modal.Header>
        {body}
      </Modal>
    )
  }
}

ProjectModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  urls: PropTypes.object,
  show: PropTypes.bool,
  dismissProject: PropTypes.func
}

export default ProjectModal
