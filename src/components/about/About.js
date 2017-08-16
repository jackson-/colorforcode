import React from 'react'
import { Route } from 'react-router-dom'
import './About.css'

const About = props => (
  <Route path='/about' render={() => (
    <div className='About'>
    <header>
     <div className="header-content">
         <div className="header-content-inner">
             <h1 id="homeHeading">var HireBlack = Diversity + Talent</h1>
             <hr/>
             <p>What happens when premium opportunities meet premium Black technology professionals ?
             No need to wonder. Its HireBlack. The different perspectives and experience our job seekers
             provide will change the industry for the better. Sign up below for release updates!</p>
             <a href="#employers" className="btn btn-primary btn-xl page-scroll">Find Out More</a>
             <link href="//cdn-images.mailchimp.com/embedcode/slim-10_7.css" rel="stylesheet" type="text/css" />
             <style type="text/css">
               /* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
                  We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
             </style>
         </div>
     </div>
   </header>
   <section className="bg-primary" id="employers">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-lg-offset-2 text-center">
                    <h2 className="section-heading">Employers, weve got what you need!</h2>
                    <hr className="light" />
                    <p className="text-faded">Diversity empowers innovation. Innovation is what companies look for in the talent they hire.
                      HireBlack provides a platform for employers and Black engineers seeking work to meet
                      and fill the gap of racial inequality in the current tech workforce. Help spread the word
                      and when you reach 5 referrals using the link below well give you your first two job postings free!</p>
                    <div className="subscription-container" >
                      <h3>Click below to signup for employer release updates!</h3>
                    <form action="http://webuildblack.us14.list-manage.com/subscribe/post?u=0b4ea00684996f451777beeb0&amp;id=742ee784dd" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div >
                    	  <input className="subscription-input" type="email" value="" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
                        <div aria-hidden="true"><input type="text" name="b_0b4ea00684996f451777beeb0_6baca1244a" tabIndex="-1" value="" /></div>
                        <div className="clear"><input type="submit" value="Subscribe" className="page-scroll btn btn-default btn-xl sr-button" /></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="about">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 text-center">
                    <h2 className="section-heading">At Your Service</h2>
                    <hr className="primary" />
                </div>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-6 text-center">
                    <div className="service-box">
                        <i className="fa fa-4x fa-diamond text-primary sr-icons"></i>
                        <h3>Quality Jobs</h3>
                        <p className="text-muted">All of our employers are vetted</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                    <div className="service-box">
                        <i className="fa fa-4x fa-paper-plane text-primary sr-icons"></i>
                        <h3>Easy to Apply</h3>
                        <p className="text-muted">One click apply method makes job seeking super simple!</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                    <div className="service-box">
                        <i className="fa fa-4x fa-newspaper-o text-primary sr-icons"></i>
                        <h3>Up to Date Skills</h3>
                        <p className="text-muted">Job seekers can show prowess with skill tags and project links.</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                    <div className="service-box">
                        <i className="fa fa-4x fa-heart text-primary sr-icons"></i>
                        <h3>Made with Love</h3>
                        <p className="text-muted">All the founders are Black engineers!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="bg-primary" id="job_seekers">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-lg-offset-2 text-center">
                    <h2 className="section-heading">Job seekers, look no further!</h2>
                    <hr className="light" />
                    <p className="text-faded">It feels good to know that an employer is looking for someone
                       like you when you walk into an interview. HireBlack is a platform that provides
                       just that. Quality Black software engineers are a highly sought out resource in
                       the technology industry. Due to an inability to find these outstanding people
                       companies have struggled in their search. Now that’s all changing. We’ve got HireBlack
                        for that. We bring the opportunities right to the people who need them. You!
                       Help spread the word and when you reach 5 referrals using the link below well
                     give you boosted rankings in the employers search!</p>

                    <div className="subscription-container" >
                      <h3>Click below to signup for job seeker release updates!</h3>
                    <form action="http://hireblack.us14.list-manage.com/subscribe/post?u=0b4ea00684996f451777beeb0&amp;id=6baca1244a" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div >
                    	  <input className="subscription-input" type="email" value="" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
                        <div aria-hidden="true"><input type="text" name="b_0b4ea00684996f451777beeb0_6baca1244a" tabIndex="-1" value="" /></div>
                        <div className="clear"><input type="submit" value="Subscribe" className="page-scroll btn btn-default btn-xl sr-button" /></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 col-lg-offset-2 text-center">
                    <h2 className="section-heading">Lets Get In Touch!</h2>
                    <hr className="primary" />
                    <p>Ready to find your next employee with us? Thats great! Give us a call or send us an email and we will get back to you as soon as possible!</p>
                </div>
                <div className="col-lg-12 text-center">
                    <i className="fa fa-envelope-o fa-3x sr-contact"></i>
                    <p><a href="mailto:info@hireblack.com">info@hireblack.io</a></p>
                </div>
            </div>
        </div>
    </section>

    </div>
  )} />
)

export default About
