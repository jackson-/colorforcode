import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SearchBar from '../utilities/SearchBar'
import LoadingSpinner from '../utilities/LoadingSpinner'
import CandidateSearchAdvanced from '../utilities/CandidateSearchAdvanced'
import CandidateList from './CandidateList.js'
import axios from 'axios'
import '../home/Home.css'

class CandidateSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      terms: [],
      coords: '',
      pendingTerms: [],
      filtered: false,
      distance: '',
      sortBy: '',
      page_num: 1,
      from: 0,
      loading: true
    }
  }

  componentWillMount () {
    const {users, fetching, authenticating, getUsers} = this.props
    if (!authenticating) {
      if (!users && !fetching) {
        getUsers()
      }
      if (users) {
        this.setState({loading: false})
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const {getUsers, authenticating} = this.props
    if (!authenticating) {
      if (!nextProps.users && !nextProps.fetching) {
        getUsers()
      }
      if (nextProps.users) {
        this.setState({loading: false})
      }
    }
  }

  handleLocation(zip_code) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
      .then(res => res.data)
      .then(json => {
        const city = json.results[0].address_components[1].long_name
        const state = json.results[0].address_components[2].short_name
        const location = `${city}, ${state}`
        const coords = `${json.results[0].geometry.location.lat},${json.results[0].geometry.location.lng}`
        this.setState({coords, zip_code, location})
      })
      .catch(err => console.error(err.stack))
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
      this.filterUsers
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
      this.filterUsers()
    } else {
      // just clear the search bar, nbd
      this.setState({query: ''})
    }
  }

  handlePagination = (users, sign) => {
    let page_num = 1
    let from = 0
    const next_page = sign === 'plus'
      ? this.state.page_num + 1
      : this.state.page_num - 1
    if (sign) {
      const nextPageHasItems = (!(this.props.users.length < 10) || sign === 'minus')
      if (next_page > 0 && nextPageHasItems) {
        page_num = next_page
        from = sign === 'plus'
          ? this.state.from + 10
          : this.state.from - 10
      } else {
        return null
      }
    }
    return {page_num, from}
  }

  filterUsers = event => {
    // this is an event handler but we also use this in clearFilter,
    // in which case there's no event object to preventDefault of
    if (event) event.preventDefault()

    const {query} = this.state
    this.props.filterUsers(query)
    // ^ when query === '', all users are shown
    if (query) this.setState({filtered: true, terms: [...this.state.pendingTerms]})
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()
  }

  buildBody = (coords, from) => {
    const {terms, distance, sortBy} = this.state
    let must = terms.map(term => ({term: {_all: term}}))
    const body = {
      query: {
        bool: {
          must,
          filter: [

          ]
        }
      },
      sort: [
        {_score: {order: 'desc'}}
      ]
    }
    if (distance) {
      body.query.bool.filter.push({
        geo_distance: {
          coords,
          distance: `${distance}mi`
        }
      })
    }
    if (sortBy === 'projectCount') {
      body.sort.push({
        _script: {
          type: 'number',
          script: 'params._source?.projects?.length ?: 0',
          order: 'desc'
        }
      })
    }
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

  advancedFilterUsers = sign => event => {
    event.preventDefault()
    const coords = this.state.coords
      ? this.state.coords
      : this.props.coords
    const {page_num, from} = this.handlePagination(this.props.users, sign)
    if (!page_num) {
      return
    }
    this.setState({
      from,
      filtered: true,
      page_num,
      loading: true
    }, this.props.advancedFilterUsers(this.buildBody, coords, from))
  }

  render () {
    const {users} = this.props
    return (
      <Row className='CandidateSearch'>
        <SearchBar
          type='project'
          inline
          id='search-talent'
          query={this.state.query}
          handleSubmit={this.filterUsers}
          handleChange={this.handleChange('query')}
          labelText='Filter users by skills'
          submitButtonText='Search'
        />
        <div className='container__flex'>
          <Col className='SearchAdvanced__container' xs={12} sm={3} md={3} lg={3}>
            <CandidateSearchAdvanced
              advancedFilterUsers={this.advancedFilterUsers()}
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
            <Row>
              <Col className='paginate-container' xs={12} sm={12} md={12} lg={12}>
                <Button className='btn-paginate' onClick={this.advancedFilterUsers('plus')}>
                  Back
                </Button>
                <span>
                  {this.state.page_num}
                </span>
                <Button className='btn-paginate' onClick={this.advancedFilterUsers('minus')}>
                  Next
                </Button>
              </Col>
            </Row>
            {
              this.state.loading
                ? <LoadingSpinner top={'20vh'} />
                : (
                  <CandidateList
                    filtered={this.state.filtered}
                    users={users || []}
                    query={this.state.query}
                    clearFilter={this.clearFilter}
                    clearChip={this.clearChip}
                    terms={this.state.terms}
                  />
                )
            }
          </Col>
        </div>
      </Row>
    )
  }
}

CandidateSearch.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  coords: PropTypes.object,
  getUsers: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func,
  fetching: PropTypes.bool,
  authenticating: PropTypes.bool
}

const mapStateToProps = state => ({
  users: state.users.all,
  authenticating: state.auth.authenticating,
  fetching: state.users.fetchingAll
})

export default connect(mapStateToProps)(CandidateSearch)
