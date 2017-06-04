import React, {Component} from 'react'
import JobInfoDisplay from './JobInfoDisplay';
import JobUpdateDisplay from './JobUpdateDisplay';
import { gettingJobById } from 'APP/src/reducers/actions/jobs'
import { connect } from 'react-redux'

class JobDetailPage extends Component {
  componentDidMount(){
    this.props.getJob(this.props.match.params.id);
  }

  render(){
    const user = this.props.user
    return(
      <div className='JobDetailPage'>
        {!this.props.loading && this.props.job && this.props.skills &&
          <div>
            {user && user.is_employer &&
              <JobUpdateDisplay user={user} skills={this.props.skills} job={this.props.job}/>
            }
            {user && !user.is_employer &&
              <JobInfoDisplay user={user} skills={this.props.skills} job={this.props.job} />
            }
            {user === "" &&
              <JobInfoDisplay user={null} skills={this.props.skills} job={this.props.job} />
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
  skills: state.skills.all,
  job: state.jobs.currentJob,
  loading: state.loading,
})
const mapDispatchToProps = dispatch => ({
  getJob: job_id => dispatch(gettingJobById(job_id)),
})

const JobDetailPageContainer = connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)

export default JobDetailPageContainer
