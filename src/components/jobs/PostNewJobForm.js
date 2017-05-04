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
      description: '',
      name: '',
      email: ''
    }
  }

  handleChange = type => event => {
    const { value } = event.target
    this.setState({[type]: value})
  }

  handleSubmit = event => {
    event.preventDefault()
    const {name, email, title, description} = this.state
    const employer = {name, email}
    const job = {title, description}
    this.props.createJobPost({employer, job})
  }

  render() {

    return (
      <div>
        <h1 className='PostJobForm-header'>Post a new job</h1>
        <form className='PostJobForm-body' onSubmit={this.handleSubmit}>
          <FormGroup controlId='name'>
            <ControlLabel>Company Name</ControlLabel>
            <FormControl
              type='text'
              value={this.state.name}
              placeholder='e.g., AirCash'
              onChange={this.handleChange('name')}
            />
          </FormGroup>
          <FormGroup controlId='email'>
            <ControlLabel>Email to receive applications</ControlLabel>
            <FormControl
              type='text'
              value={this.state.email}
              placeholder='e.g., hiring@aircash.io'
              onChange={this.handleChange('email')}
            />
          </FormGroup>
          <FormGroup controlId='title'>
            <ControlLabel>Job Title</ControlLabel>
            <FormControl
              type='text'
              value={this.state.title}
              placeholder='e.g., Senior DevOps Engineer'
              onChange={this.handleChange('title')}
            />
          </FormGroup>
          <FormGroup controlId='description'>
            <ControlLabel>Job Description and Requirements</ControlLabel>
            <FormControl
              type='text'
              componentClass='textarea'
              value={this.state.description}
              onChange={this.handleChange('description')}
            />
          </FormGroup>
          <Button className='primary' type='submit'>Post Job</Button>
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
