import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Row, Col, Button, FormGroup,
  FormControl, ControlLabel, Glyphicon } from 'react-bootstrap'
import { uploadingResume } from '../../reducers/actions/users'

class ResumeUploader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data_uri: null,
      processing: false,
      changeResume: false,
      filename: 'No file selected'
    }
  }

  handleChangeResume = event => {
    event.preventDefault()
    this.setState({changeResume: true})
  }

  cancelChgResume = event => {
    event.preventDefault()
    this.setState({
      data_uri: null,
      processing: false,
      changeResume: false
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
    const {data_uri, file} = this.state
    const {user, uploadResume} = this.props
    this.setState({
      uploaded_uri: data_uri,
      changeResume: false
    }, () => uploadResume(user, file))
  }

  render () {
    const {changeResume} = this.state
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          {
            changeResume
              ? (
                <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                  <FormGroup controlId='image'>
                    <ControlLabel srOnly>Upload Resume</ControlLabel>
                    <FormControl
                      type='file'
                      onChange={this.handleFile}
                      className='resume-upload'
                    />
                  </FormGroup>
                  <Button
                    className='resume-btn'
                    bsSize='xs'
                    disabled={this.state.processing || !this.state.data_uri}
                    type='submit'
                  >
                    Save Resume
                  </Button>
                  <Button
                    className='resume-btn'
                    bsSize='xs'
                    onClick={this.cancelChgResume}
                  >
                    Cancel
                  </Button>
                </form>
              )
              : (
                <Button className='resume-btn' bsSize='xs' onClick={this.handleChangeResume}>
                  <Glyphicon glyph='file' /> Upload Resume
                </Button>
              )
          }
        </Col>
      </Row>
    )
  }
}

ResumeUploader.propTypes = {
  user: PropTypes.any,
  uploadResume: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  uploadResume: (user, file) => dispatch(uploadingResume(user, file))
})

export default connect(null, mapDispatchToProps)(ResumeUploader)
