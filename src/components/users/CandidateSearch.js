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
      zip_code: '',
      employment_types: new Set([]),
      distance: '',
      sortBy: '',
      page_num: 1,
      from: 0,
      loading: true
    }
  }

  componentWillMount () {
    const {allUsers, fetching, authenticating, getUsers} = this.props
    if (!authenticating) {
      if (!allUsers && !fetching) {
        getUsers()
      }
      if (allUsers) {
        this.setState({loading: false})
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const {getUsers, authenticating} = this.props
    if (!authenticating) {
      if (!nextProps.allUsers && !nextProps.fetching) {
        getUsers()
      }
      if (nextProps.allUsers || nextProps.filteredUsers) {
        this.setState({loading: false})
      }
    }
  }

  handleLocation = zip_code => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
      .then(res => res.data)
      .then(json => {
        const geometry = json.results[0].geometry.location
        const coords = {lat: parseFloat(geometry.lat), lng: parseFloat(geometry.lng)}
        this.setState({coords})
      })
      .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    const {value} = event.target
    const nextState = {}
    nextState[`${type}`] = value
    if (type === 'query') nextState.pendingTerms = value.split(' ')
    if (type === 'zip_code' && value.toString().length >= 5) {
      /* first we finish updating the state of the input, then we use the zip to find the rest of the location data by passing the callback to setState (an optional 2nd param) */
      this.setState({[type]: value}, this.handleLocation(value))
    } else {
      this.setState(nextState)
    }
  }

  getValidationState = (type) => {
    const {zip_code, distance, sortBy} = this.state
    if (sortBy === 'distance' && (!zip_code || !distance)) return 'error'
    else if (type === 'zip_code') {
      if (zip_code.length < 5 && distance.length > 0) return 'error'
      else if (distance.length > 0 && zip_code.length > 0) return null
    } else {
      if (!distance && zip_code.length > 0) return 'error'
      else if (distance.length > 0 && zip_code.length > 0) return null
    }
  }

  toggleJobTypes = event => {
    const {value} = event.target
    this.state.employment_types.has(value)
      ? this.state.employment_types.delete(value)
      : this.state.employment_types.add(value)
    const employment_types = new Set([...this.state.employment_types])
    /* ^Using a Set instead of an array because we want the data values to be unique */
    this.setState({employment_types})
  }

  clearFilter = filter => {
    if (filter) {
      // if this method is invoked with a filter param,
      // we reset all search interface elements by:
      // clearing the search bar, showing all job listings, and hiding search-header
      // see SearchAdvanced.js line 21 (the Clear Filter button onClick)
      this.setState({
        query: '',
        terms: [],
        coords: '',
        pendingTerms: [],
        filtered: false,
        zip_code: '',
        employment_types: new Set([]),
        distance: '',
        sortBy: '',
        page_num: 1,
        from: 0,
        loading: false
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
      {terms, loading: true},
      () => {
        if (query) this.props.filterUsers(query)
        else this.props.getUsers()
      }
      // ^second param of setState (optional) is callback to execute after setting state
    )
  }

  clearFilter = filter => event => {
    if (filter) {
      // if this method is invoked with a filter param,
      // we reset all search interface elements by:
      // clearing the search bar, showing all job listings, and hiding search-header
      // see SearchAdvanced.js line 21 (the Clear Filter button onClick)
      this.setState({
        query: '',
        pendingTerms: [],
        terms: [],
        distance: '',
        sortBy: '',
        zip_code: '',
        coords: '',
        employment_types: new Set([]),
        loading: false
      }, this.props.getUsers)
    } else {
      // just clear the search bar, nbd
      this.setState({query: '', pendingTerms: []})
    }
  }

  handlePagination = (users, sign) => {
    let page_num = 1
    let from = 0
    const next_page = sign === 'plus'
      ? this.state.page_num + 1
      : this.state.page_num - 1
    if (sign) {
      const nextPageHasItems = (!(users.length < 10) || sign === 'minus')
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
    // this is an event handler but we also use this in clearFilter & clearChip,
    // in which case there's no event object to call preventDefault on
    if (event) event.preventDefault()
    const {query} = this.state
    // ^ when query === '', we don't filter so all job listings continue to be shown
    if (query) {
      this.setState({
        filtered: true,
        terms: [...this.state.pendingTerms],
        loading: true
      }, this.props.filterUsers(query))
    }
    // we only show the search results header if this.state.filtered === true
    this.clearFilter()()
  }

  buildBody = (coords, from) => {
    const {terms, distance, employment_types, sortBy} = this.state
    return {
      terms,
      coords,
      distance,
      employment_types: [...employment_types],
      sortBy
    }
  }

  advancedFilterUsers = sign => event => {
    event.preventDefault()
    const {filtered, filteredUsers, allUsers, advancedFilterUsers} = this.props
    const coords = this.state.coords
      ? this.state.coords
      : ''
    const users = filtered ? filteredUsers : allUsers
    const {page_num, from} = this.handlePagination(users, sign)
    if (!page_num) {
      return
    }
    this.setState({
      from,
      filtered: true,
      page_num,
      loading: true
    }, advancedFilterUsers(this.buildBody, coords, from))
  }

  render () {
    const {allUsers, filteredUsers, filtered} = this.props
    const {loading} = this.state
    const users = !filteredUsers || !filtered ? allUsers : filteredUsers
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
              toggleCheckbox={this.toggleJobTypes}
              validate={this.getValidationState}
              handleChange={this.handleChange}
              clearFilter={this.clearFilter}
              clearChip={this.clearChip}
              filtered={this.props.filtered}
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
              loading
                ? <LoadingSpinner top={'20vh'} />
                : (
                  <CandidateList
                    filtered={this.props.filtered}
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
  allUsers: PropTypes.arrayOf(PropTypes.object),
  filteredUsers: PropTypes.arrayOf(PropTypes.object),
  filtered: PropTypes.bool,
  coords: PropTypes.any, // either '' (for falsey-ness) or an object
  getUsers: PropTypes.func,
  filterUsers: PropTypes.func,
  advancedFilterUsers: PropTypes.func,
  fetching: PropTypes.bool,
  authenticating: PropTypes.bool
}

const mapStateToProps = state => ({
  allUsers: state.users.all,
  filteredUsers: state.users.filteredUsers,
  filtered: state.users.filtered,
  authenticating: state.auth.authenticating,
  fetching: state.users.fetchingAll
})

export default connect(mapStateToProps)(CandidateSearch)
