import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ImageUploader from './ImageUploader'
import ResumeUploader from './ResumeUploader'
import { updatingUser, uploadingAvatar, uploadingResume } from '../../reducers/actions/users'

class JobSeekerDashboard extends Component {

  render(){
    let apps = [];
    this.props.user && this.props.user.applications.forEach((app)=>{
      let url = "/job/"+app.id
      apps.push(
        <li key={app.id}>
          <Link to={url}>{app.title}</Link>
        </li>
      )
    })
    return(
      <div className='Home'>
        {this.props.user &&
          <h2>{`Welcome, ${this.props.user.first_name} ${this.props.user.last_name}`}</h2>
        }
        <div id='activity'>
          <Link to='/projects'>My Projects</Link>
          <ImageUploader uploadAvatar={this.props.uploadAvatar}  user={this.props.user}/>

          <ResumeUploader uploadResume={this.props.uploadResume}  user={this.props.user}/>
          <div id="resume-photo">
          <iframe src={this.props.user.resume_url}></iframe>
          </div>
          <h3>Applied Jobs</h3>
          <ul>
            {apps}
          </ul>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
})

const mapDispatchToProps = dispatch => ({
  updateUser: (user) => dispatch(updatingUser(user)),
  uploadAvatar: (user, file) => dispatch(uploadingAvatar(user, file)),
  uploadResume: (user, file) => dispatch(uploadingResume(user, file)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobSeekerDashboard))
