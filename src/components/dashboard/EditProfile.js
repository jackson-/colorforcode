import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import axios from 'axios'
import EmployerFields from '../auth/EmployerRegisterFields'
import ApplicantFields from '../auth/ApplicantRegisterFields'
import ResumeUploader from '../dashboard/ResumeUploader'
import '../auth/Form.css'
import './Dashboard.css'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'

class EditProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: this.props.user ? this.props.user.email : '',
      password: '',
      passwordConfirm: '',
      company_name: this.props.user && this.props.user.is_employer ? this.props.user.employer.name : '',
      company_role: this.props.user ? this.props.user.company_role : '',
      headline: this.props.user ? this.props.user.headline : '',
      title: this.props.user ? this.props.user.title : '',
      summary: this.props.user ? this.props.user.summary : '',
      first_name: this.props.user ? this.props.user.first_name : '',
      last_name: this.props.user ? this.props.user.last_name : '',
      zip_code: this.props.user ? this.props.user.zip_code : '',
      location: this.props.user ? this.props.user.location : '',
      image_url: this.props.user ? this.props.user.image_url : '',
      company_site: this.props.user && this.props.user.is_employer ? this.props.user.employer.company_site : '',
      personal_site: this.props.user ? this.props.user.personal_site : '',
      github: this.props.user ? this.props.user.github : '',
      linkedin: this.props.user ? this.props.user.linkedin : '',
      twitter: this.props.user ? this.props.user.twitter : '',
      work_auth: this.props.user ? this.props.user.work_auth : '',
      employment_types: this.props.user && this.props.user.employment_types
        ? new Set([...this.props.user.employment_types])
        : new Set([])
    }
  }

  handleLocation = zip_code => {
    axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${zip_code}`)
      .then(res => res.data)
      .then(json => {
        const address = json.results[0].address_components.filter(c => (
          c.types.includes('locality') ||
          c.types.includes('administrative_area_level_1') ||
          c.types.includes('country')
        ))
        const city = address[0].long_name
        const state = address[1].short_name
        const country = address[2].long_name
        const location = country === 'United States' ? `${city}, ${state}` : `${city}, ${state} ${country}`
        const coords = `${json.results[0].geometry.location.lat},${json.results[0].geometry.location.lng}`
        this.setState({coords, zip_code, location})
      })
      .catch(err => console.error(err.stack))
  }

  handleChange = type => event => {
    const {value} = event.target
    if (type === 'zip_code' && value.toString().length >= 5) {
      /* first we finish updating the state of the input, then we use the zip to find the rest of the location data by passing the callback to setState (an optional 2nd param) */
      this.setState({[type]: value}, this.handleLocation(value))
    } else if (type === 'employment_types') {
      this.state.employment_types.has(value)
        ? this.state.employment_types.delete(value)
        : this.state.employment_types.add(value)
      const employment_types = new Set([...this.state.employment_types])
      /* ^Using a Set instead of an array because we need the data values to be unique */
      this.setState({employment_types})
    } else if (type === 'work_auth' || type === 'company_role') {
      value === 'select'
        ? this.setState({[type]: ''})
        : this.setState({[type]: value})
    } else {
      this.setState({[type]: value})
    }
  }

  isChecked = type => {
    return this.state.employment_types.has(type)
  }

  clearForm = () => {
    this.setState({
      email: this.props.user ? this.props.user.email : '',
      password: '',
      passwordConfirm: '',
      company_name: this.props.user && this.props.user.is_employer ? this.props.user.employer.name : '',
      company_role: this.props.user ? this.props.user.company_role : '',
      headline: this.props.user ? this.props.user.headline : '',
      title: this.props.user ? this.props.user.title : '',
      summary: this.props.user ? this.props.user.summary : '',
      first_name: this.props.user ? this.props.user.first_name : '',
      last_name: this.props.user ? this.props.user.last_name : '',
      zip_code: this.props.user ? this.props.user.zip_code : '',
      location: this.props.user ? this.props.user.location : '',
      image_url: this.props.user ? this.props.user.image_url : '',
      company_site: this.props.user && this.props.user.is_employer ? this.props.user.employer.company_site : '',
      personal_site: this.props.user ? this.props.user.personal_site : '',
      github: this.props.user ? this.props.user.github : '',
      linkedin: this.props.user ? this.props.user.linkedin : '',
      twitter: this.props.user ? this.props.user.twitter : '',
      work_auth: this.props.user ? this.props.user.work_auth : '',
      employment_types: this.props.user && this.props.user.employment_types
        ? new Set([...this.props.user.employment_types])
        : new Set([])
    })
  }

  getValidationState = () => {
    const { password, passwordConfirm } = this.state
    if (password === '' || passwordConfirm === '') return null
    else if (password === passwordConfirm) return 'success'
    else return 'error'
  }

  isInvalid = () => {
    const {
      first_name,
      last_name,
      company_name,
      company_site,
      company_role,
      email,
      zip_code,
      location,
      title,
      work_auth
    } = this.state

    if (this.props.user.is_employer) {
      return !(
        first_name &&
        last_name &&
        company_name &&
        company_role &&
        company_site &&
        zip_code &&
        email
      )
    } else {
      return !(
        first_name &&
        last_name &&
        email &&
        zip_code &&
        location &&
        work_auth &&
        title
      )
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const user = {...this.state}
    user.id = this.props.user.id
    // turn the set into an array (postgres rejects sets)
    user.employment_types = [...user.employment_types]
    this.clearForm()
    this.props.updateUser(user)
    this.props.uploadResume(this.props.user, this.refs.resume.state.file)
  }

  render () {
    const {user} = this.props
    let fields = ''
    if (user && user.is_employer) {
      fields = (
        <EmployerFields
          state={this.state}
          handleChange={this.handleChange}
          validate={this.getValidationState}
          isInvalid={this.isInvalid()}
          buttonText={'Update Profile'}
        />
      )
    } else if (user && !user.is_employer) {
      fields = (
        <ApplicantFields
          state={this.state}
          handleChange={this.handleChange}
          validate={this.getValidationState}
          isChecked={this.isChecked}
          isInvalid={this.isInvalid()}
          buttonText={'Update Profile'}
        />
      )
    }

    return (
      <Row className='EditProfile fadeIn animated'>
        <ScrollToTopOnMount />
        <Col xs={12} sm={12} md={12} lg={12}>
          <h1 className='EditProfile-header'>Edit Profile</h1>
          {
            !user.is_employer &&
            <ResumeUploader
              ref='resume'
              uploadResume={this.props.uploadResume}
              user={this.props.user}
            />
          }
          {
            !user.is_employer &&
            <a href={user.resume_url} target='_blank'>
              <p>{`Resume currently on file: ${user.resume_url.substring(43)}`}</p>
            </a>
          }
          <form className='EditProfile-body' onSubmit={this.handleSubmit}>
            {fields}
            {user.resume_url &&
              <a href={user.resume_url}><p>Current Resume</p></a>
            }
          </form>
        </Col>
      </Row>
    )
  }
}

EditProfile.propTypes = {
  user: PropTypes.any,
  updateUser: PropTypes.func,
  uploadResume: PropTypes.func
}

export default EditProfile
