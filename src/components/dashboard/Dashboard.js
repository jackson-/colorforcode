import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { updatingUser, uploadingResume } from '../../reducers/actions/users'
import { gettingAllJobs, deletingJob, creatingNewJob,
         applyingToJob, unsavingJob } from '../../reducers/actions/jobs'
import { gettingProjectById, updatingProject,
         receiveProject, deletingProject } from 'APP/src/reducers/actions/projects'
import EmployerDashboard from './EmployerDashboard'
import ApplicantDashboard from './ApplicantDashboard'


class Dashboard extends Component {

  render () {
    const {
      user,
      loading,
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
      skills
    } = this.props

    return (
      <div>
        {!loading && user &&
          <div>
            {
              user.is_employer

                ? <EmployerDashboard
                    user={user}
                    jobs={user.employer.listings}
                    updateUser={updateUser}
                    closeJob={closeJob}
                    duplicateJob={duplicateJob}
                    match={this.props.match}
                  />

                : <ApplicantDashboard
                    project={project}
                    skills={skills}
                    user={user}
                    updateUser={updateUser}
                    updateProject={updateProject}
                    uploadResume={uploadResume}
                    deleteProject={deleteProject}
                    getProject={getProject}
                    receiveProject={receiveProject}
                    unsaveJob={unsaveJob}
                    applyToJob={applyToJob}
                  />
            }
          </div>
        }
        {loading && <div>Loading...</div>}
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object,
  project: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
  applyToJob: PropTypes.func.isRequired,
  unsaveJob: PropTypes.func.isRequired,
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  getJobs: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  jobs: PropTypes.array,
  skills: PropTypes.array
}

const mapStateToProps = state => ({
  project: state.projects.currentProject,
  user: state.users.currentUser,
  loading: state.loading,
  skills: state.skills.all,
  jobs: state.jobs.all
})

const mapDispatchToProps = dispatch => ({
  applyToJob: (userId, jobId, history) => dispatch(applyingToJob(userId, jobId, history)),
  unsaveJob: (userId, savedJobs) => dispatch(unsavingJob(userId, savedJobs)),
  getJobs: () => dispatch(gettingAllJobs()),
  closeJob: (id, history) => dispatch(deletingJob(id, history)),
  duplicateJob: (job, history) => dispatch(creatingNewJob(job, history)),
  updateUser: (user) => dispatch(updatingUser(user)),
  uploadResume: (user, file) => dispatch(uploadingResume(user, file)),
  getProject: (id) => dispatch(gettingProjectById(id)),
  updateProject: (project, history) => dispatch(updatingProject(project, history)),
  deleteProject: (projectId, history) => dispatch(deletingProject(projectId, history)),
  receiveProject: (project) => dispatch(receiveProject(project))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
