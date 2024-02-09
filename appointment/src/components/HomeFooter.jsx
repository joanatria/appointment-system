import React from 'react'
import "../styles/Profile.css";

const HomeFooter = () => {
  return (
    <div id="footbar">
      <nav>
        <ul>
          <li><h4 style={{ color: '#FFFFFF' }}>© Doc Click Connect. All Rights Reserved. 2023</h4></li>
          <li style={{ float: 'right' }}>
            <h4 style={{ color: '#FFFFFF' }}>
              <a href="mailto:sdocclick@gmail.com" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
              sdocclick@gmail.com
              </a>
            </h4>
          </li>

        </ul>
      </nav>
    </div>
  )
}

export default HomeFooter
