import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { gettingAllUsers, filteringUsers } from 'APP/src/reducers/actions/users'
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import SearchBar from '../utilities/SearchBar'
import CandidateSearchAdvanced from '../utilities/CandidateSearchAdvanced'
import CandidateList from './CandidateList.js'
// import './Home.css'

class CandidateSearch extends Component {

  constructor (props) {
    super(props)
    this.state = {
      query: '',
      terms: [],
      pendingTerms:[],
      filtered: false,
      distance:'',
      project_count:null
    }
  }

  componentDidMount () {
    this.props.getUsers()
  }

  handleChange = type => event => {
    const {value} = event.target
    const nextState = {}
    nextState[`${type}`] = value
    if (type === 'query') nextState.pendingTerms = value.split(' ')
    this.setState(nextState)
  }

  clearFilter = filter => {
    if (filter) {
      // if this method is invoked with a filter param,
      // we reset all search interface elements by:
      // clearing the search bar, showing all job listings, and hiding search-header
      // see SearchAdvanced.js line 21 (the Clear Filter button onClick)
      this.setState({
        query: '',
        pendingTerms: [],
        terms: [],
        sortBy: '',
        filtered: false
      })
      this.filterUsers()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  clearChip = event => {
    event.preventDefault()
    const chipToClear = event.target.value
    let terms = this.state.terms.filter(term => {
      return term !== chipToClear && term !== ''
    })
    const query = terms.join(' ')
    this.setState(
      {terms, query, filtered: query.length > 0},
      this.filterJobs
      // ^second param of setState (optional) is callback to execute after setting state
    )
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

  filterUsers = events => {
    // this is an event handler but we also use this in clearFilter,
    // in which case there's no event object to preventDefault of
    if (event) event.preventDefault()

    const {query} = this.state
    this.props.filterUsers(query)
    // ^ when query === '', all job listings are shown
    if (query) this.setState({filtered: true, terms: [...this.state.pendingTerms]})
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()
  }

  buildBody = coords => {
    const {terms, distance, employment_types, sortBy} = this.state
    let must = {};
    [...employment_types].forEach(type => {
      must.match = {employment_types: type}
    })
    let should = terms.map(term => ({term: {_all: term}}))
    const body = {
      query: {
        bool: {
          must,
          should,
          filter: [

          ]
        }
      },
      sort: [{_score: {order: 'desc'}}]
    }
    if (distance) {
      body.query.bool.filter.push({
        geo_distance: {
          coords,
          distance: `${distance}mi`
        }
      })
    }
    if (sortBy === 'date') body.sort.push({updated_at: {order: 'desc'}})
    if (sortBy === 'distance') {
      body.sort = [{
        _geo_distance: {
          coords,
          order: 'asc',
          unit: 'mi',
          distance_type: 'arc'
        }
      }]
    }
    return body
  }

  render () {
    let users = this.props.users || []
    return (
      <Row className='JobBoard'>
        <SearchBar
          type='project'
          inline
          query={this.state.query}
          handleSubmit={this.filterUsers}
          handleChange={this.handleChange('query')}
          labelText='Filter users by skills'
          submitButtonText='Search'
        />
        {
          this.props.loading
            ? <p>Loading Candidates...</p>
            :
            <div className='container__flex'>
              <Col className='SearchAdvanced__container' xs={12} sm={3} md={3} lg={3}>
                <CandidateSearchAdvanced
                  filterJobs={this.advancedFilterUsers}
                  handleChange={this.handleChange}
                  clearFilter={this.clearFilter}
                  clearChip={this.clearChip}
                  filtered={this.state.filtered}
                  query={this.state.query}
                  terms={this.state.terms}
                  state={this.state}
                />
              </Col>
              <Col xs={12} sm={9} md={9} lg={9}>
                <CandidateList
                    filtered={this.state.filtered}
                    users={users}
                    query={this.state.query}
                    clearFilter={this.clearFilter}
                    clearChip={this.clearChip}
                    terms={this.state.terms}
                  />
              </Col>
            </div>

        }
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users.all,
  skills: state.skills.all,
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  getUsers: post => dispatch(gettingAllUsers()),
  getSkills: post => dispatch(gettingAllSkills()),
  filterUsers: query => dispatch(filteringUsers(query))
})

export default connect(mapStateToProps, mapDispatchToProps)(CandidateSearch)
