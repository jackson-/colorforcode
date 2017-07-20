import React, { Component } from 'react'
import { gettingUserById } from 'APP/src/reducers/actions/users'
import { connect } from 'react-redux'

class JobDetailPage extends Component {
  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }

  render() {
    let user = null
    const user_source = this.props.user
    if(user_source){
      user = user_source._source
    }
    return (
      <div className='JobDetailPage'>
        {user &&
          <div>
            <h1>User Detail</h1>
            <p>{user.email}</p>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.selected,
  history: state.router.history
})

const mapDispatchToProps = dispatch => ({
  getUser: job_id => dispatch(gettingUserById(job_id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)
