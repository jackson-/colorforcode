import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { receiveRouterState } from '../../reducers/actions/router'
import Navbar from './Navbar'
import './App.css'
import { logout } from '../../reducers/actions/users'

class App extends Component {

  componentWillReceiveProps(nextProps) {
    const {match, location, history} = nextProps
    this.props.passRouterState({match, location, history})
  }

  render () {
    return (
      <div>
        <Navbar
          user={this.props.user}
          logOut={this.props.logOut(this.props.history)}
        />
        <Grid fluid className='App'>
          { this.props.children && React.cloneElement(this.props.children, this.props) }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser
})

const mapDispatchToProps = dispatch => ({
  logOut: history => event => {
    event.preventDefault()
    dispatch(logout(history))
  },
  passRouterState: (routerState) => dispatch(receiveRouterState(routerState))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
