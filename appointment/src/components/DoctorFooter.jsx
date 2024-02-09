import React from 'react'
import "../styles/Profile.css";
import { Link } from 'react-router-dom';

const DoctorFooter = () => {
  return (
    <div id="footbar">
        <nav>
            <ul>
                <li><h4 style={{ color: '#FFFFFF' }}>© Doc Click Connect. All Rights Reserved. 2023</h4></li>
                <li style={{float:"right"}}><Link to={"/about"}>About Us!</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default DoctorFooter
