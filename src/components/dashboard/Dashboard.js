import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { updatingUser } from '../../reducers/actions/users'
import { deletingJob, creatingNewJob } from '../../reducers/actions/jobs'
import { gettingProjectById, updatingProject, receiveProject } from 'APP/src/reducers/actions/projects'
import EmployerDashboard from './EmployerDashboard'
import ApplicantDashboard from './ApplicantDashboard'

class Dashboard extends Component {
  render () {
    const {
      user,
      loading,
      closeJob,
      duplicateJob,
      updateUser,
      updateProject,
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
                  />

                : <ApplicantDashboard
                    project={project}
                    skills={skills}
                    user={user}
                    updateUser={updateUser}
                    updateProject={updateProject}
                    getProject={getProject}
                    receiveProject={receiveProject}
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
  closeJob: PropTypes.func.isRequired,
  duplicateJob: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  project: state.projects.currentProject,
  user: state.users.currentUser,
  loading: state.loading,
  skills: state.skills.all
})

const mapDispatchToProps = dispatch => ({
  closeJob: (id, history) => dispatch(deletingJob(id, history)),
  duplicateJob: (job, history) => dispatch(creatingNewJob(job, history)),
  updateUser: (user) => dispatch(updatingUser(user)),
  getProject: (id) => dispatch(gettingProjectById(id)),
  updateProject: (project, history) => dispatch(updatingProject(project, history)),
  receiveProject: (project) => dispatch(receiveProject(project))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
