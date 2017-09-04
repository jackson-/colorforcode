import axios from 'axios'
import {
  RECEIVE_SKILLS, RECEIVE_SELECTED_SKILLS,
  REQUEST_ALL_SKILLS, CREATE_SKILLS } from '../constants'

/* --------- PURE ACTION CREATORS --------- */
export const receiveSkills = skills => ({
  skills,
  loading: false,
  type: RECEIVE_SKILLS
})

export const receiveSelectedSkills = selected => ({
  selected,
  type: RECEIVE_SELECTED_SKILLS
})

export const requestAllSkills = () => ({
  type: REQUEST_ALL_SKILLS
})

export const createSkills = () => ({
  type: CREATE_SKILLS
})

/* --------- ASYNC ACTION CREATORS (THUNKS) --------- */

export const gettingAllSkills = () => dispatch => {
  dispatch(requestAllSkills())
  axios.get('/api/skills')
    .then(res => res.data)
    .then(skills => dispatch(receiveSkills(skills)))
    .catch(err => console.error(`Mang, I couldn't find any skills! ${err.stack}`))
}

export const creatingNewSkills = skills => dispatch => {
  dispatch(createSkills())
  axios.post('/api/skills', {skills})
    .then(res => res.data)
    .then(skills => dispatch(receiveSkills(skills)))
    .catch(err => console.error(`Mang, I couldn't create those skills! ${err.stack}`))
}
