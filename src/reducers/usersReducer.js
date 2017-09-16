import {
  RECEIVE_ALL_USERS, REQUEST_ALL_USERS, RECEIVE_USER, PAGINATE_USERS,
  REQUEST_USER, REQUEST_FILTERED_USERS, RECEIVE_FILTERED_USERS } from './constants'

const initialState = {
  fetchingSelected: false,
  selected: null,
  fetchingAll: false,
  all: null,
  filteredUsers: null,
  filtered: false,
  filter: null,
  // we persist employer's search parameters between navigations to/from home and user detail pages
  offset: 0,
  pageNum: 1
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredUsers: state.filteredUsers ? [...state.filteredUsers] : null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case RECEIVE_ALL_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: action.users,
      filteredUsers: null,
      filtered: false,
      filter: null,
      offset: 0,
      pageNum: 1
    }
    case REQUEST_FILTERED_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: true,
      all: state.all ? [...state.all] : null,
      filteredUsers: state.filteredUsers ? [...state.filteredUsers] : null,
      filtered: state.filteredUsers !== null,
      filter: action.filter,
      offset: 0,
      pageNum: 1
    }
    case RECEIVE_FILTERED_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredUsers: action.users,
      filtered: true,
      filter: {...state.filter},
      offset: 0,
      pageNum: 1
    }
    case PAGINATE_USERS: return {
      fetchingSelected: false,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredUsers: state.filteredUsers ? [...state.filteredUsers] : null,
      filtered: state.filteredUsers !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: action.offset,
      pageNum: action.pageNum
    }
    case REQUEST_USER: return {
      fetchingSelected: true,
      selected: null,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredUsers: state.filteredUsers ? [...state.filteredUsers] : null,
      filtered: state.filteredUsers !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: state.offset,
      pageNum: state.pageNum
    }
    case RECEIVE_USER: return {
      fetchingSelected: false,
      selected: action.selected,
      fetchingAll: false,
      all: state.all ? [...state.all] : null,
      filteredUsers: state.filteredUsers ? [...state.filteredUsers] : null,
      filtered: state.filteredUsers !== null,
      filter: state.filter ? {...state.filter} : null,
      offset: state.offset,
      pageNum: state.pageNum
    }

    default: return state
  }
}

export default usersReducer
