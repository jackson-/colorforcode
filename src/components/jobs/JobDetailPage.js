import React, {Component} from 'react'
import JobInfoDisplay from './JobInfoDisplay';
import JobUpdateDisplay from './JobUpdateDisplay';
import { gettingAllSkills } from 'APP/src/reducers/actions/skills'
import { gettingJobById } from 'APP/src/reducers/actions/jobs'
import { connect } from 'react-redux'

class JobDetailPage extends Component {
  componentDidMount(){
    this.props.getJob(this.props.match.params.id);
    this.props.getSkills();
  }

  render(){
    const user = this.props.user
    return(
      <div className='JobDetailPage'>
        {!this.props.loading &&
          <div>
            {user && user.employer &&
              <JobUpdateDisplay user={user} skills={this.props.skills} job={this.props.job}/>
            }
            {user && !user.employer &&
              <JobInfoDisplay user={user} skills={this.props.skills} job_id={this.props.job} />
            }
            {!user &&
              <JobInfoDisplay user={user} skills={this.props.skills} job_id={this.props.job} />
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
  getSkills: post => dispatch(gettingAllSkills()),
})

const JobDetailPageContainer = connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)

export default JobDetailPageContainer
