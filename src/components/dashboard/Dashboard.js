import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EmployerDashboard from './EmployerDashboard'
import ApplicantDashboard from './ApplicantDashboard'
import LoginForm from '../auth/LoginForm'

class Dashboard extends Component {
  render () {
    const {
      user,
      updateJob,
      deleteJob,
      getJob,
      saveJob,
      unsaveJob,
      applyToJob,
      closeJob,
      duplicateJob,
      updateUser,
      updateProject,
      uploadResume,
      deleteProject,
      getProject,
      project,
      skills,
      handleNewSkills,
      location,
      receiveNext,
      receiveAlert
    } = this.props
    console.log('DASHBOARD LOCATION: ', location)
    return (
      <div className='fadeIn animated'>
        {
          user &&
          <div>
            {
              user.is_employer
                ? (
                  <EmployerDashboard
                    user={user}
                    jobs={user.employer.listings}
                    skills={skills}
                    handleNewSkills={handleNewSkills}
                    updateUser={updateUser}
                    closeJob={closeJob}
                    duplicateJob={duplicateJob}
                    updateJob={updateJob}
                    deleteJob={deleteJob}
                    getJob={getJob}
                    receiveAlert={receiveAlert}
                    receiveNext={receiveNext}
                  />
                )

                : (
                  <ApplicantDashboard
                    project={project}
                    skills={skills}
                    handleNewSkills={handleNewSkills}
                    user={user}
                    updateUser={updateUser}
                    updateProject={updateProject}
                    uploadResume={uploadResume}
                    deleteProject={deleteProject}
                    getProject={getProject}
                    getJob={getJob}
                    saveJob={saveJob}
                    unsaveJob={unsaveJob}
                    applyToJob={applyToJob}
                    receiveAlert={receiveAlert}
                    receiveNext={receiveNext}
                  />
                )
            }
          </div>
        }
        {!user && <LoginForm />}
      </div>
    )
  }
}

Dashboard.propTypes = {
  fetchingCurrentUser: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.any,
  project: PropTypes.object,
  job: PropTypes.object,
  uploadResume: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  saveJob: PropTypes.func.isRequired,
  getJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object),
  skills: PropTypes.arrayOf(PropTypes.object),
  handleNewSkills: PropTypes.func,
  receiveNext: PropTypes.func,
  receiveAlert: PropTypes.func,
  alert: PropTypes.object,
  next: PropTypes.string
}

export default Dashboard
