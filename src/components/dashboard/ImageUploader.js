import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button, FormGroup, Image,
         FormControl, ControlLabel, Glyphicon } from 'react-bootstrap'
import { uploadingAvatar } from '../../reducers/actions/users'
import { uploadingScreenshot } from '../../reducers/actions/projects'
import blankAvatar from './blank-avatar.png'

class ImageUploader extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data_uri: null,
      processing: false,
      changeImg: false,
      filename: 'No file selected'
    }
  }

  handleChangeImg = event => {
    event.preventDefault()
    this.setState({changeImg: true})
  }

  cancelChgImg = event => {
    event.preventDefault()
    this.setState({
      data_uri: null,
      processing: false,
      changeImg: false
    })
  }

  handleFile = event => {
    const reader = new FileReader()
    const file = event.target.files[0]
    debugger
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
    if (this.props.type === 'Avatar') {
      this.props.uploadAvatar(this.props.user, this.state.file)
    } else {
      this.props.uploadScreenshot(this.props.project, this.state.file)
    }

    this.setState({
      uploaded_uri: this.state.data_uri,
      changeImg: false
    })
  }

  render () {
    const {user, type, label, buttonText, project} = this.props
    const {changeImg} = this.state
    let src = ''
    if (type === 'Avatar') {
      src = user ? user.image_url : ''
    } else {
      src = project ? project.screenshot : ''
    }
    if (!src) src = blankAvatar
    return (
      <Row>
        <Col>
          <Image
            className='user-avatar'
            circle={type === 'Avatar'}
            responsive
            src={src}
            alt={`uploaded image`}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {
            changeImg
            ? (
              <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                <FormGroup controlId='image'>
                  <ControlLabel srOnly>{label}</ControlLabel>
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
                  onClick={this.cancelChgImg}
                >
                  Cancel
                </Button>
              </form>
            )
            : (
              <Button className='avatar-btn' bsSize='xs' onClick={this.handleChangeImg}>
                <Glyphicon glyph='camera' /> {buttonText}
              </Button>
            )
          }
        </Col>
      </Row>
    )
  }
}

ImageUploader.propTypes = {
  type: PropTypes.string, // Capitalized e.g., Avatar, Screenshot
  user: PropTypes.any,
  project: PropTypes.object,
  label: PropTypes.string, // Profile Picture, Project Screenshot, etc
  buttonText: PropTypes.string, // Change Avatar, Upload Screenshot, etc
  uploadAvatar: PropTypes.func,
  uploadScreenshot: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  uploadAvatar: (user, file) => dispatch(uploadingAvatar(user, file)),
  uploadScreenshot: (project, file) => dispatch(uploadingScreenshot(project, file))
})

export default connect(null, mapDispatchToProps)(ImageUploader)
