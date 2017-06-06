import React, { Component } from 'react'
import EmployerDashboard from './EmployerDashboard'
import { connect } from 'react-redux'

class Dashboard extends Component {

  render(){
    const user = this.props.user
    return(
      <div className='JobDetailPage'>
        {!this.props.loading && this.props.user &&
          <div>
            {user && user.is_employer &&
              <EmployerDashboard user={user} />
            }
          </div>
        }
        {this.props.loading &&
          <div>
            Loading...
          </div>
        }
      </div>
  )}
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  loading: state.loading,
})

const JobDetailPageContainer = connect(mapStateToProps, null)(Dashboard)

export default JobDetailPageContainer
