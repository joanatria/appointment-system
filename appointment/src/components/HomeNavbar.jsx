import React from 'react'
import "../styles/Profile.css";
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  return (
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
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/faqs">FAQs</Link></li>
        <li style={{ float: 'right' }}><Link to="/patlogin">Patient</Link></li>
        <li style={{ float: 'right' }}><Link to="/doclogin">Doctor</Link></li>
      </ul>
    </nav>
  </div>
  )
}

export default HomeNavbar
