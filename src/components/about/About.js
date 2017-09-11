import React from 'react'
import { Row, Col } from 'react-bootstrap'
import './About.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const About = ({animated}) => {
  return (
    <Row className={`About fadeIn ${animated}`}>
      <Col xs={12} sm={12} md={12} lg={12}>
        <Row>
          <Col className='About__hero' xs={12} sm={12} md={12} lg={12}>
            <div className='hero-overlay' />
            <div className='About__hero-header'>
              <h1 className='About__hero-heading'>
                VAR COLOR_FOR_CODE =
              </h1>
              <h1 className='About__hero-heading'>
                DIVERSITY + TALENT
              </h1>
              <hr className='About__hero-separator' />
              <h2 className='About__hero-text'>
                Join us in breathing new life into the tech industry.
              </h2>
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
              {`Diversity empowers innovation. Innovation is what you're looking for in your next hire. Color for Code is a technology recruitment platform. We're connecting Black software engineers and designers with companies like yours, building teams as colorful as your growing user base.`}
            </p>
            <Link to='/register'>
              <span className='btn-oval btn-oval--white'>
                SIGN UP!
              </span>
            </Link>
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
                All of our employers are vetted.
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-paper-plane text-primary sr-icons' />
              <h3>Easy to Apply</h3>
              <p className='About__text text-muted'>
                One click apply makes job seeking super simple!
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-newspaper-o text-primary sr-icons' />
              <h3>Up to Date Skills</h3>
              <p className='About__text text-muted'>
                Job seekers demonstrate prowess with projects.
              </p>
            </div>
          </Col>
          <Col className='text-center' xs={12} sm={6} md={3} lg={3}>
            <div className='service-box'>
              <i className='fa fa-4x fa-heart text-primary sr-icons' />
              <h3>Made with Love</h3>
              <p className='About__text text-muted'>
                Built and founded by Black engineers!
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
              {`It feels good to walk into an interview knowing the employer is looking for someone just like you. Color for Code is a technology recruitment platform that provides just that. We're connecting talented Black designers and engineers like you with innovative companies that don't just talk about the value of diversity—they cultivate it.`}
            </p>
            <Link to='/register'>
              <span className='btn-oval btn-oval--white'>
                SIGN UP!
              </span>
            </Link>
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
              Ready to find your next employee with us? Send us an email and we'll get back to you as soon as possible.
            </p>
          </Col>
          <Col className='text-center' xs={12} sm={12} md={12} lg={12}>
            <i className='fa fa-envelope-o fa-3x sr-contact' />
            <a href='mailto:info@colorforcode.com'>
              <p className='About__text text-primary'>
                info@colorforcode.com
              </p>
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

About.propTypes = {
  animated: PropTypes.string
}

export default About
