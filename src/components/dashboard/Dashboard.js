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
      getJob,
      saveJob,
      unsaveJob,
      applyToJob,
      closeJob,
      duplicateJob,
      updateUser,
      updateProject,
      deleteProject,
      getProject,
      project,
      handleNewSkills,
      receiveNext,
      receiveAlert,
      animated
    } = this.props
    return (
      <div className={`fadeIn ${animated}`}>
        {
          user &&
          <div>
            {
              user.is_employer
                ? (
                  <EmployerDashboard
                    user={user}
                    jobs={user.employer.listings}
                    handleNewSkills={handleNewSkills}
                    updateUser={updateUser}
                    closeJob={closeJob}
                    duplicateJob={duplicateJob}
                    updateJob={updateJob}
                    getJob={getJob}
                    receiveAlert={receiveAlert}
                    receiveNext={receiveNext}
                    animated={animated}
                  />
                )

                : (
                  <ApplicantDashboard
                    project={project}
                    handleNewSkills={handleNewSkills}
                    user={user}
                    updateUser={updateUser}
                    updateProject={updateProject}
                    deleteProject={deleteProject}
                    getProject={getProject}
                    getJob={getJob}
                    saveJob={saveJob}
                    unsaveJob={unsaveJob}
                    applyToJob={applyToJob}
                    receiveAlert={receiveAlert}
                    receiveNext={receiveNext}
                    animated={animated}
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
  animated: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.any,
  project: PropTypes.object,
  job: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateJob: PropTypes.func.isRequired,
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
