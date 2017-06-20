import React, {Component} from 'react'
import { NavLink,Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ImageUploader from './ImageUploader'
import { gettingUserApps } from '../../reducers/actions/jobs'

class JobSeekerDashboard extends Component {

  componentWillReceiveProps(){
    if(this.props.user && !this.props.jobs){
      console.log("PROPS", this.props)
      // this.props.getApps(this.props.user)
    }
  }

  _savePic(input){
    debugger;
  }

  render(){
    let apps = [];
    this.props.apps && this.props.apps.forEach((app)=>{
      let url = "/job/"+app.id
      apps.push(
        <li key={app.id}>
          <Link to={url}>{app.job.title}</Link>
        </li>
      )
    })
    return(
      <div className='Home'>
        {this.props.user &&
          <h2>{`Welcome, ${this.props.user.first_name} ${this.props.user.last_name}`}</h2>
        }
        <div id='activity'>
          <ImageUploader />
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
  apps: state.jobs.user_jobs
})

const mapDispatchToProps = dispatch => ({
  getApps: (user) => dispatch(gettingUserApps(user)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobSeekerDashboard))
