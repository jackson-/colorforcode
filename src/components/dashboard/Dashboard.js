import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { updatingUser } from '../../reducers/actions/users'
import { deletingJob, creatingNewJob } from '../../reducers/actions/jobs'
import EmployerDashboard from './EmployerDashboard'
import ApplicantDashboard from './ApplicantDashboard'

class Dashboard extends Component {
  render () {
    const {user, loading} = this.props
    // if (!user) return <Redirect to='/login' />
    return (
      <div>
        {!loading && user &&
          <div>
            {
              user && user.is_employer &&
                <EmployerDashboard
                  user={this.props.user}
                  jobs={user.employer.listings}
                  updateUser={this.props.updateUser}
                  closeJob={this.props.closeJob}
                  duplicateJob={this.props.duplicateJob}
                />
            }
            {user && !user.is_employer && <ApplicantDashboard user={this.props.user} updateUser={this.props.updateUser} />}
          </div>
        }
        {loading && <div>Loading...</div>}
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  closeJob: (id, history) => dispatch(deletingJob(id, history)),
  duplicateJob: (job, history) => dispatch(creatingNewJob(job, history)),
  updateUser: (user) => dispatch(updatingUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
