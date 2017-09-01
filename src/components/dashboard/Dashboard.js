import React from 'react'
import PropTypes from 'prop-types'
import EmployerDashboard from './EmployerDashboard'
import ApplicantDashboard from './ApplicantDashboard'

const Dashboard = ({
  user,
  job,
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
  location,
  match
}) => {
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
                  updateUser={updateUser}
                  closeJob={closeJob}
                  duplicateJob={duplicateJob}
                  match={match}
                  updateJob={updateJob}
                  deleteJob={deleteJob}
                  getJob={getJob}
                />
              )

              : (
                <ApplicantDashboard
                  project={project}
                  skills={skills}
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
                  match={match}
                />
              )
          }
        </div>
      }
    </div>
  )
}

Dashboard.propTypes = {
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
  jobs: PropTypes.array,
  skills: PropTypes.array
}

export default Dashboard
