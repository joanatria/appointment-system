import React, { useEffect, useState, useCallback } from 'react';
import "../styles/Profile.css";
import { Link } from 'react-router-dom';

const PatientNavBar = ({ username }) => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patientdetails/${username}`);
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsError(false); // Reset error state on successful fetch
      } else {
        setIsError(true);
        console.error(`Failed to fetch user details. Status: ${response.status}`);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error during fetchUser:', error);
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patientlogout/${username}`, {
        method: 'POST',
        });

        if (response.status === 200) {
        setMessage('Logged out successfully');
        window.location.href = '/patlogin';
        } else if (response.status === 401) {
        console.log('No user is currently logged in');
        } else {
          console.log('An error occurred');
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
            <Link to="/patprofile">
            <img
              src={require('../images/DOC LOGO.png')}
              alt="Doc Click Connect"
              style={{ maxWidth: '100px', maxHeight: '40px', marginRight: '20px', marginLeft: '-50px' }}
            /></Link>
        </li>
      </ul>
      <ul>
      <li><Link to={`/patprofile/${username}`}>My Profile</Link></li>
        <li><Link to={`/editpatprofile/${username}`}>Edit Profile</Link></li>
        <li><Link to={`/patappointments/${username}`}>My Appointments</Link></li>
        <li><Link to={`/docsearch/${username}`}>Search Doctors</Link></li>
        <li style={{ float: 'right' }}>
          {user ? (
            <span style={{ color: "white", fontSize: "15px" }}>Hello, {user.user.firstName}! </span>
          ) : (
            isError ? (
              <p> </p>
            ) : (
              <p>Loading...</p>
            )
          )}
          <button onClick={handleLogout}>Log Out</button>
          <p>{message}</p>
        </li>
      </ul>
    </nav>
    {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
  </div>
  )
}

export default PatientNavBar
