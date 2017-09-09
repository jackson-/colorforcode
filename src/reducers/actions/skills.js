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

export const creatingNewSkills = (newSkills, selected) => dispatch => {
  dispatch(createSkills())
  axios.post('/api/skills', {skills: newSkills})
    .then(res => res.data)
    .then(updatedSkills => {
      // map newSkills to a reference array of titles
      newSkills = newSkills.map(s => s.title)
      // filter down the updatedSkills list to the new ones and reassign it to newSkills
      newSkills = updatedSkills.filter(skill => newSkills.includes(skill.title))
      // add the new skills to the list of selected skills (phew!)
      selected = [...selected, ...newSkills]
      dispatch(receiveSelectedSkills(selected))
      dispatch(receiveSkills(updatedSkills))
    })
    .catch(err => console.error(`Mang, I couldn't create those skills! ${err.stack}`))
}
