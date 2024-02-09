import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import HomeFooter from '../components/HomeFooter';

const Home = () => {
  return (
    <div style={{overflowX: "hidden"}}>
      <div id="navbar">
        <nav>
          <ul>
            <li style={{ float: 'left' }}>
                <Link to="/">
                <img
                  src={require('../images/DOC LOGO.png')}
                  alt="Doc Click Connect"
                  style={{ maxWidth: '100px', maxHeight: '40px', marginRight: '20px', marginLeft: '-50px' }}
                /></Link>
            </li>
            <li><a href="#about">About Us</a></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li style={{ float: 'right' }}><Link to="/patlogin">Patient</Link></li>
            <li style={{ float: 'right' }}><Link to="/doclogin">Doctor</Link></li>
          </ul>
        </nav>
      </div>

    <div style={{width: "100vw", overflowX: "hidden"}}>
        <div className="info-container" style={{width: "100vw", overflowX: "hidden"}}>
                <img
                    src={require('../images/homepage img.png')}
                    alt="DOC Click Connect"
                    style={{ position:'relative', maxWidth: '100%', marginTop:'85%'}}
                />
                <div className='overlay-text-img'>
                    <h1>Doc Click Connect</h1>
                    At Doc Click Connect, we are dedicated to your well-being. Our <br/> 
                    team of experienced and compassionate healthcare professionals  <br/> 
                    is here to provide you with the highest quality medical care. Whether   <br/> 
                    you're seeking preventive care, treatment for an illness, or specialized  <br/> 
                    medical services, we've got you covered. <br/>
                    <br/>
                    <Link to="/patlogin"><button>Set an appointment now!</button></Link>
                </div>
                <div>
                    <br />
                    <h2 style={{ color: '#0094d4' }}>Set an Appointment through 2 EASY STEPS</h2>
                    <br />
                </div>
                <div className="steps" style={{backgroundColor: '#f6f5f7'}}>
                    <div className="step-card" style={{backgroundColor: '#f6f5f7'}}>
                        <h3 className='number'>1</h3>
                        <h3>REGISTER</h3>
                        <p>Let us know about you. <br />Fill up and complete the required registration details.</p>
                    </div>
                    <div className="step-card" style={{backgroundColor: '#f6f5f7'}}>
                        <h3 className='number'>2</h3>
                        <h3>BOOK</h3>
                        <p>Book your appointment <br /> and request a schedule <br /> that works for you.</p>
                    </div>
                </div>
                <div id='about'>
                    <h1 style={{ color: '#ffffff', background: '#0094d4', width: '100vw', height: '50px', textAlign: 'center', margin: 0, padding: '10px'}}>ABOUT US</h1>
                    <p style={{ color: '#ffffff', background: '#0094d4', padding: '10px', textAlign: 'center', margin: 0 }}>Welcome to Doc Click Connect, an innovative platform designed to simplify the appointment scheduling process for both patients and doctors.</p>
                </div>
                <div className="steps">
                    <div className="step-card">
                        <br />
                        <br />
                        <br />
                        <h3 style={{fontSize: "25px"}}>OUR MISSION</h3>
                        <p style={{fontSize: "17px", lineHeight: "1.5"}}>We aim to bridge the gap between patients<br/> and doctors, making it easier to schedule <br/> and coordinate medical appointments.  </p>
                    </div>
                    <div className="step-card">
                        <img
                            src={require('../images/mission.png')}
                            alt="mission"
                            style={{ maxWidth: '100%', maxHeight: '100hw', margin: 0}}
                        />
                    </div>
                </div>
                <div className="steps"  style={{marginTop:'-10px'}}>
                    <div className="step-card">
                        <img
                            src={require('../images/vision.png')}
                            alt='vision'
                            style={{ maxWidth: '100%', maxHeight: '100hw', margin: 0}}
                        />
                    </div>
                    <div className="step-card">
                        <br />
                        <br />
                        <br />
                        <h3 style={{fontSize: "25px"}}>OUR VISION</h3>
                        <p style={{fontSize: "17px", lineHeight: "1.5"}}>We envision a world where scheduling medical<br/> appointments is convenient and accessible for everyone.<br/>  We aim to optimize this process by providing a seamless<br/> and intuitive platform that empowers patients to<br/>  take control of their health.</p>
                    </div>
                </div>
            </div>
        </div>

        <HomeFooter />
    </div>
  );
}

export default Home;
