import { RECEIVE_SKILLS, RECEIVE_PROJECT, RECEIVE_JOB, RECEIVE_JOBS } from './constants'

const initialState = {
  all: [],
  selected: []
}

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SKILLS: return {
      all: action.skills,
      currentSkill: {...state.currentSkill} || null
    }

    case RECEIVE_PROJECT: return {
      all: action.skills,
      currentSkill: {...state.currentSkill} || null
    }

    case RECEIVE_JOB: return {
      all: action.skills,
      currentSkill: {...state.currentSkill} || null
    }

    case RECEIVE_JOBS: return {
      all: action.skills,
      currentSkill: {...state.currentSkill} || null
    }

    default: return state
  }
}

export default skillsReducer
