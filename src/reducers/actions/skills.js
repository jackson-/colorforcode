import axios from 'axios'
import { RECEIVE_ALL_SKILLS } from '../constants'
import { requestAllSkills } from './loading'

/* --------- PURE ACTION CREATORS ---------*/
export const receiveAllSkills = skills => ({
  skills,
  loading: false,
  type: RECEIVE_ALL_SKILLS
})


// export const receiveSkill = skill => ({
//   skill,
//   type: RECEIVE_SKILL
// })

/* --------- ASYNC ACTION CREATORS (THUNKS) ---------*/

export const gettingAllSkills = () => dispatch => {
  dispatch(requestAllSkills())
  axios.get('/api/skills')
  .then(res => res.data)
  .then(skills => dispatch(receiveAllSkills(skills)))
  .catch(err => console.error(`Mang, I couldn't find any skills! ${err.stack}`))
}
