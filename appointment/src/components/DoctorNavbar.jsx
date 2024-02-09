import React, { useEffect, useState, useCallback } from 'react';
import "../styles/Profile.css";
import { Link } from 'react-router-dom';

const DoctorNavbar = ({ username }) => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);


  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/doctordetails/${username}`);

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsError(false); // Reset error state on successful fetch
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/doctorlogout/${username}`, {
        method: 'POST',
      });

      if (response.status === 200) {
        setMessage('Logged out successfully');
        window.location.href = '/doclogin';
      } else if (response.status === 401) {
        setMessage('No user is currently logged in');
      } else {
        setMessage('An error occurred');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
  };
  return (
    <div id="navbar">
      <nav>
        <ul>
          <li style={{ float: 'left' }}>
            <Link to={`/docprofile/${username}`}>
              <img
                src={require('../images/DOC LOGO.png')}
                alt="Doc Click Connect"
                style={{ maxWidth: '100px', maxHeight: '40px', marginRight: '20px', marginLeft: '-50px' }}
              />
            </Link>
          </li>
        </ul>
        <ul>
          <li><Link to={`/docprofile/${username}`}>My Profile</Link></li>
          <li><Link to={`/editdocprofile/${username}`}>Edit Profile</Link></li>
          <li><Link to={`/docappointments/${username}`}>My Appointments</Link></li>
          <li><Link to={`/docaddclinic/${username}`}>Add Clinic</Link></li>
          <li><Link to={`/docclinic/${username}`}>My Clinics</Link></li>
          <li style={{ float: 'right' }}>
            {user ? (
              <span style={{ color: "white", fontSize: "15px" }}>Hello, {user.user.firstName}! </span>
            ) : (
              isError ? (
                <p>Error fetching user profile</p>
              ) : (
                <p>Loading user profile...</p>
              )
            )}
            <button onClick={handleLogout}>Log Out</button>
            <p>{message}</p>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default DoctorNavbar