import React from 'react'
import { Row, Col } from 'react-bootstrap'
import './About.css'

const About = ({animated}) => {
  const anim = animated ? 'animated' : ''
  return (
    <Row className={`About fadeIn ${anim}`}>
      <Col xs={12} sm={12} md={12} lg={12}>
        <Row>
          <Col className='About__hero' xs={12} sm={12} md={12} lg={12}>
            <div className='hero-overlay' />
            <div className='About__hero-header'>
              <h1 className='About__hero-heading'>
                VAR HIREBLACK = DIVERSITY + TALENT
              </h1>
              <hr className='About__hero-separator' />
              <p className='About__hero-text'>
                {`What happens when premium opportunities meet premium Black technology professionals? No need to wonder. It's HireBlack. The different perspectives and experience our job seekers provide are changing the industry for the better.`}
              </p>
            </div>
          </Col>
        </Row>
        <Row className='About__section bg-primary'>
          <Col
            className='text-center'
            xs={12} sm={12}
            md={8} mdOffset={2}
            lg={8} lgOffset={2}
          >
            <h2 className='section-heading'>
              {`Employers, we've got what you need!`}
            </h2>
            <hr className='About__separator-white' />
            <p className='About__text text-faded'>
              {`Diversity empowers innovation. Innovation is what companies look for in the talent they hire. HireBlack provides a platform for hiring employers and Black engineers and designers seeking opportunities to meet and fill the gap of racial inequality in the current tech landscape.`}
            </p>
          </Col>
        </Row>
        <Row className='About__section'>
          <Col className='text-center' xs={12} sm={12} md={12} lg={12}>
            <h2 className='section-heading'>
              At Your Service
            </h2>
            <hr className='About__separator' />
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-diamond text-primary sr-icons' />
              <h3>Quality Jobs</h3>
              <p className='About__text text-muted'>
                All of our employers are vetted
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-paper-plane text-primary sr-icons' />
              <h3>Easy to Apply</h3>
              <p className='About__text text-muted'>
                One click apply method makes job seeking super simple!
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-newspaper-o text-primary sr-icons' />
              <h3>Up to Date Skills</h3>
              <p className='About__text text-muted'>
                Job seekers can show prowess with skill tags and project links.
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-heart text-primary sr-icons' />
              <h3>Made with Love</h3>
              <p className='About__text text-muted'>
                All the founders are Black engineers!
              </p>
            </div>
          </Col>
        </Row>
        <Row className='About__section bg-primary'>
          <Col className='text-center'
            xs={12} sm={12}
            md={8} mdOffset={2}
            lg={8} lgOffset={2}
          >
            <h2 className='section-heading'>
              Job seekers, look no further!
            </h2>
            <hr className='About__separator-white' />
            <p className='About__text text-faded'>
              {`It feels good to know that an employer is looking for someone like you when you walk into an interview. HireBlack is a platform that provides just that. We connect talented black designers and engineers with innovative companies that don't just talk about the value of diversity—they cultivate it.`}
            </p>
          </Col>
        </Row>
        <Row className='About__section'>
          <Col
            className='text-center'
            xs={12} sm={12}
            md={8} mdOffset={2}
            lg={8} lgOffset={2}
          >
            <h2 className='section-heading'>
              {`Let's Get In Touch!`}
            </h2>
            <hr className='About__separator' />
            <p className='About__text'>
              Ready to find your next employee with us? Give us a call or send us an email and we will get back to you as soon as possible!
            </p>
          </Col>
          <Col className='text-center' xs={12} sm={12} md={12} lg={12}>
            <i className='fa fa-envelope-o fa-3x sr-contact' />
            <a href='mailto:info@hireblack.com'>
              <p className='About__text text-primary'>
                info@hireblack.io
              </p>
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default About
