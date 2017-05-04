import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { creatingNewJob } from 'APP/src/reducers/actions/jobs'
import './PostNewJobForm.css'

class PostJobForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: ''
    }
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.createJobPost(this.state)
  }

  render() {
    return (
      <div>
        <h1 className='PostNewJobForm-header'>Create your job posting</h1>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId='title'>
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter a job title"
              onChange={this.handleChange('title')}
            />
          </FormGroup>
          <FormGroup controlId='description'>
            <ControlLabel>Description</ControlLabel>
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter a description"
              onChange={this.handleChange('description')}
            />
          </FormGroup>
          <Button type='submit'>Post Job</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  createJobPost: post => dispatch(creatingNewJob(post))
})

const PostNewJobContainer = connect(mapStateToProps, mapDispatchToProps)(PostJobForm)

export default PostNewJobContainer
