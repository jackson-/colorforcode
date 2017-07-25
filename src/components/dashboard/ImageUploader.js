import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button, FormGroup, Image, ButtonToolbar,
         FormControl, ControlLabel, Glyphicon } from 'react-bootstrap'
import { uploadingAvatar } from '../../reducers/actions/users'
import blankAvatar from './blank-avatar.png'

class ImageUploader extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data_uri: null,
      processing: false,
      changeAvatar: false
    }
  }

  handleChangeAvatar = event => {
    event.preventDefault()
    this.setState({changeAvatar: true})
  }

  cancelChgAvatar = event => {
    event.preventDefault()
    this.setState({
      data_uri: null,
      processing: false,
      changeAvatar: false
    })
  }

  handleFile = event => {
    const reader = new FileReader()
    const file = event.target.files[0]

    reader.onload = (upload) => {
      this.setState({
        file,
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      })
    }

    reader.readAsDataURL(file)
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.uploadAvatar(this.props.user, this.state.file)
    this.setState({
      uploaded_uri: this.state.data_uri,
      changeAvatar: false
    })
  }

  render () {
    const {user} = this.props
    const {uploaded_uri, changeAvatar} = this.state
    return (
      <Row>
        <Col>
          <Image
            className='user-avatar'
            circle
            responsive
            src={user.image_url ? user.image_url : blankAvatar }
            alt={`${user.first_name}'s' avatar`}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {
            changeAvatar
            ? <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                <FormGroup controlId='profile-pic'>
                  <ControlLabel srOnly>Profile picture</ControlLabel>
                  <FormControl type='file' onChange={this.handleFile} />
                </FormGroup>
                <Button
                  className='avatar-btn'
                  bsSize='xs'
                  disabled={this.state.processing || !this.state.data_uri}
                  type='submit'
                >
                  Save Image
                </Button>
                <Button
                  className='avatar-btn'
                  bsSize='xs'
                  onClick={this.cancelChgAvatar}
                >
                  Cancel
                </Button>
              </form>

            : <Button className='avatar-btn' bsSize='xs' onClick={this.handleChangeAvatar}>
                <Glyphicon glyph='camera' /> Change Avatar
              </Button>
          }
        </Col>
      </Row>
    )
  }
}

ImageUploader.propTypes = {
  user: PropTypes.object,
  uploadAvatar: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  uploadAvatar: (user, file) => dispatch(uploadingAvatar(user, file))
})

export default connect(null, mapDispatchToProps)(ImageUploader)
