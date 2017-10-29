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
                eventKey={1}
                header='Problem'
                onClick={this.handleSelect(1)}
                onKeyUp={this.handleSelect(1)}
                tabIndex={this.activeKey === 1 ? 1 : 0}
              >
                <div
                  className='Project__panel-content'
                  dangerouslySetInnerHTML={{__html: project.problem}}
                />
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={2}
                header='Approach'
                onClick={this.handleSelect(2)}
                onKeyUp={this.handleSelect(2)}
                tabIndex={this.activeKey === 2 ? 1 : 0}
              >
                <div
                  className='Project__panel-content'
                  dangerouslySetInnerHTML={{__html: project.approach}}
                />
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={3}
                header='Challenges'
                onClick={this.handleSelect(3)}
                onKeyUp={this.handleSelect(3)}
                tabIndex={this.activeKey === 3 ? 1 : 0}
              >
                <div
                  className='Project__panel-content'
                  dangerouslySetInnerHTML={{__html: project.challenges}}
                />
              </Panel>
              <Panel
                className='Project__detail-panel'
                eventKey={4}
                header='Outcome'
                onClick={this.handleSelect(4)}
                onKeyUp={this.handleSelect(4)}
                tabIndex={this.activeKey === 4 ? 1 : 0}
              >
                <div
                  className='Project__panel-content'
                  dangerouslySetInnerHTML={{__html: project.outcome}}
                />
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
