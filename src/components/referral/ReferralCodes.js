import React, {Component} from 'react'
import '../auth/Form.css'
import PropTypes from 'prop-types'
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import ScrollToTopOnMount from '../utilities/ScrollToTopOnMount'
import axios from 'axios'

class ReferralCodes extends Component {
    constructor (props) {
      super(props)
      this.state = {
        code: null,
        generating:false,
        name:'',
        email:'',
        phone:''
      }
    }

    handleChange = type => event => {
        const { value } = event.target
        this.setState({[type]: value})
    }

    clearForm = () => {
        this.setState({
            email: '',
            phone: '',
            name:'',
        })
    }

    isInvalid = () => {
        const { email, phone, name } = this.state
        return !(email && name)
    }

    handleSubmit = event => {
        event.preventDefault()
        const { email, phone, name } = this.state
        this.clearForm()
        axios.post('/api/referralcodes', {email, phone, name}).then((res) => {
            this.setState({code:res.data})
        })
    }

    render(){
        const {code, generating} = this.state;
        let display
        if(code){
            display = 
                <Row className='LoginForm fadeIn animated'>
                    <ScrollToTopOnMount />
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <p>Your referral code is {code}. Be sure that your 
                        friends use this when register as an engineer on our platform.
                        If they get a job through one of our percentage fee posts 
                        we'll call you to up to give you your cut of the profits.</p>
                    </Col>
                </Row>
        } else {
            display =
                <Row className='LoginForm fadeIn animated'>
                    <ScrollToTopOnMount />
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <h4 className='LoginForm-header'>This is the info we will be contacting 
                        you with to give you your money so please fill it out with something you check regularly
                    </h4>
                    <div className='form-container'>
                        <h1 className='LoginForm-header'>GENERATE REFERRAL CODE</h1>
                        
                        <form className='LoginForm-body' onSubmit={this.handleSubmit}>
                        <FormGroup controlId='name'>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl
                            type='name'
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            />
                        </FormGroup>
                        <FormGroup controlId='email'>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                            type='email'
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            />
                        </FormGroup>
                        <FormGroup controlId='phone'>
                            <ControlLabel>Phone</ControlLabel>
                            <FormControl
                            type='phone'
                            value={this.state.phone}
                            onChange={this.handleChange('phone')}
                            />
                        </FormGroup>
                        <Button
                            disabled={this.isInvalid()}
                            bsStyle='default'
                            type='submit'
                            className='btn-login-reg'
                        >
                            Submit
                        </Button>
                        </form>
                    </div>
                    </Col>
                </Row>}
        return(display)
    }
}
export default ReferralCodes