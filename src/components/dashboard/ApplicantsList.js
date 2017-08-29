import React, { Component } from 'react'
import { Table, Row, Accordion, Panel } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconBar from '../utilities/icons/IconBar'
import TwitterIcon from '../utilities/icons/TwitterIcon'
import LinkIcon from '../utilities/icons/LinkIcon'
import GithubIcon from '../utilities/icons/GithubIcon'
import LinkedInIcon from '../utilities/icons/LinkedInIcon'
import './ManageJobs.css'

export default class Applicants extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeKey: 1
    }
  }

  handleSelect = activeKey => event => {
    this.setState({activeKey})
  }

  mostRecentDate = job => {
    const {created_at, updated_at} = job
    if (Date.parse(created_at) < Date.parse(updated_at)) {
      return new Date(updated_at).toLocaleDateString()
    } else {
      return new Date(created_at).toLocaleDateString()
    }
  }

  sortByDate = list => {
    return list.sort((a, b) => {
      return Date.parse(a.created_at) - Date.parse(b.created_at)
    })
  }

  render () {
    const {jobs} = this.props
    if (jobs) this.sortByDate(jobs)
    return (
      <Row className='Applicants'>
        <h1 className='Applicants-header'>YOUR APPLICANTS</h1>
        <Accordion defaultActiveKey={1} activeKey={this.state.activeKey}>
          {
            jobs.filter(job => !!job.applicants).map((job, i) => (
              <Panel
                key={i}
                header={job.title}
                eventKey={i + 1}
                className='Applicants__panel'
                onClick={this.handleSelect(i + 1)}
              >
                <Table responsive className='Applicants__table'>
                  <thead>
                    <tr>
                      <td>APPLICANTS</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.sortByDate(job.applicants).map((app, i) => {
                        const links = [
                          {type: 'github', label: 'Github Profile', component: <GithubIcon />},
                          {type: 'linkedin', label: 'LinkedIn Profile', component: <LinkedInIcon />},
                          {type: 'twitter', label: 'Twitter Profile', component: <TwitterIcon />},
                          {type: 'personal_site', label: 'Personal Site', component: <LinkIcon />}
                        ]
                        let icons = []
                        links.forEach(link => {
                          if (app[link.type]) {
                            icons.push({
                              text: link.label,
                              component: link.component,
                              url: app[link.type]
                            })
                          }
                        })
                        return (
                          <tr key={`${job.id}${i}${app.id}`}>
                            <td>
                              <a href={`/users/${app.id}`}>{app.first_name} {app.last_name}</a>
                            </td>
                            <td>
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td>{app.location}</td>
                            <td>
                              <IconBar icons={icons} color='green' />
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </Panel>
            ))
          }
        </Accordion>
      </Row>
    )
  }
}

Applicants.propTypes = {
  jobs: PropTypes.array.isRequired
}
