import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Sidebar.css'
import {Modal, Button} from 'react-bootstrap'
import {withRouter} from 'react-router-dom'
import {dismissAlert} from 'APP/src/reducers/actions/alert'

class MyModal extends Component {

  onHide = () => {
    this.props.dismissAlert()
    this.props.history.push(this.props.next)
  }

  render(){
    return (
      <Modal show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.body}
        </Modal.Body>

      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dismissAlert: (history) => dispatch(dismissAlert(history)),
})

MyModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string
}

export default withRouter(connect(null, mapDispatchToProps)(MyModal))
