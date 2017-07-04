import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { gettingAllJobs, filteringJobs } from 'APP/src/reducers/actions/jobs'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import JobList from './JobList.js'
import './Home.css'

class JobBoard extends Component {

  constructor(props){
    super(props)
    this.state = {
      query: '',
      filtered: false
    }
  }

  componentDidMount() {
    this.props.getJobs()
  }

  handleChange = event => {
    this.setState({query: event.target.value})
  }

  clearFilter = (filter) => {
    if (filter) {
      // clear the search bar, show all job listings, and hide search header
      this.setState({
        query: '',
        filtered: false
      })
      this.filterJobs()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  filterJobs = event => {
    // this is an event handler but we also use this in clearFilter,
    // in which case there's no event object to preventDefault of
    if (event) event.preventDefault()

    const {query} = this.state
    this.props.filterJobs(query)
    // ^ when query === '', all job listings are shown,
    if (query) this.setState({filtered: true})
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()
  }

  render() {
    let jobs = this.props.jobs || []
    return (
      <Row className='JobBoard'>
        <form className='JobBoard-filter-container' onSubmit={this.filterJobs}>
          <FormGroup controlId='query'>
            <ControlLabel srOnly>Filter job listings</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              className='JobBoard-filter'
              value={this.state.query}
            />
          </FormGroup>
          <Button type='submit'>Filter Jobs</Button>
        </form>
        {
          this.props.loading
            ? <p>Loading...</p>
            : <JobList
                filtered={this.state.filtered}
                jobs={jobs}
                clear={this.clearFilter}
              />
        }
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  jobs: state.jobs.all,
  skills: state.skills.all,
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  getJobs: post => dispatch(gettingAllJobs()),
  getSkills: post => dispatch(gettingAllSkills()),
  filterJobs: query => dispatch(filteringJobs(query))
})

export default connect(mapStateToProps, mapDispatchToProps)(JobBoard)
