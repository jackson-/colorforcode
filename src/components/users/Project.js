import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Row, Col, Image, Accordion, Panel } from 'react-bootstrap'
import blankAvatar from 'APP/src/components/dashboard/blank-avatar.png'
import './Project.css'

class Project extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeKey: 1
    }
  }

  handleSelect = activeKey => event => {
    this.setState({activeKey})
  }

  render () {
    const {project, handleOnLoad} = this.props
    return (
      <Grid fluid style={{width: 'auto'}}>
        <Row>
          <Col
            className='Project__column Project__image--container'
            xs={12} sm={12} md={12} lg={12}
          >
            <Image
              src={project.screenshot ? project.screenshot : blankAvatar}
              alt='project screenshot'
              responsive
              className='Project__image'
              onLoad={handleOnLoad}
            />
          </Col>
        </Row>
        <Row>
          <Col className='Project__column' xs={12} sm={12} md={12} lg={12}>
            <Accordion
              className='Project__detail-panel-group'
              activeKey={this.state.activeKey}
              defaultActiveKey={1}
            >
              <Panel
                className='Project__detail-panel'
                eventKey={1} header='Problem'
                onClick={this.handleSelect(1)}
              >
                <p className='Project__panel-content'>{project.problem}</p>
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={2} header='Approach'
                onClick={this.handleSelect(2)}
              >
                <p className='Project__panel-content'>{project.approach}</p>
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={3} header='Challenges'
                onClick={this.handleSelect(3)}
              >
                <p className='Project__panel-content'>{project.challenges}</p>
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={4} header='Outcome'
                onClick={this.handleSelect(4)}
              >
                <p className='Project__panel-content'>{project.outcome}</p>
              </Panel>
            </Accordion>
          </Col>
        </Row>
      </Grid>
    )
  }
}

Project.propTypes = {
  project: PropTypes.object,
  handleOnLoad: PropTypes.func
}

export default Project
