import { RECEIVE_ALL_SKILLS } from './constants'

const initialState = {
  all: [],
  selected: []
}

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ALL_SKILLS: return {
      all: action.skills,
      currentSkill: {...state.currentSkill} || null
    }
    default: return state
  }
}

export default skillsReducer
