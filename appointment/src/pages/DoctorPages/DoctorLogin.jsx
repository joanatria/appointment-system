import React, { useState, useEffect } from 'react';
import "../../styles/Login.css";
import HomeNavbar from '../../components/HomeNavbar';
import HomeFooter from '../../components/HomeFooter';

function DoctorLogin() {
    const overlayH1Style = { color: '#ffffff' };
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Check if the user is already logged in (you can implement your own logic)
    const isLoggedIn = false; // Replace with your actual login check logic

    if (isLoggedIn) {
      // Redirect to the profile page if already logged in
      window.location.href = '/profile';
    }
  }, []);

  const handleLogin = async () => {
    try {
      const url = new URL('https://railway-backend-production-a8c8.up.railway.app/doctorlogin');
      url.searchParams.append('username', username);
      url.searchParams.append('password', password);

      const response = await fetch(url, {
        method: 'POST',
      });

      if (response.ok) {
        // Login successful
        setLoginError('');
        window.location.href = `/docprofile/${username}`; // Redirect to the profile page
      } else {
        // Login failed
        const errorMessage = await response.text();
        setLoginError(errorMessage);
      }
    } catch (error) {
      setLoginError('An error occurred during login');
    }
  };

  const handleToSignup = () => {
    window.location.href = '/docreg';
  };



    return (
      <div>
      <div className="container" id="container">
        <HomeNavbar />
        <div className="form-container sign-in-container">
        <form action="#" id="signin-form">
          <h1 style={{ color: '#0094d4' }}>Doctor Login</h1>
          <div className="infield">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="infield">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <a href="#" class="forgot">Forgot your password?</a> */}
          <button type="button" onClick={handleLogin}>
            Login
          </button>
          {loginError && <p className="verification-message">{loginError}</p>}
        </form>
      </div>
        <div className="overlay-container" id="overlayCon">
              <div className="overlay">
                  <div className="overlay-panel overlay-right">
                      <h1 style={overlayH1Style}>Hello there!</h1>
                      <p>Register a new doctor? <br />Enter your details now!</p>
                      <button onClick={handleToSignup}>Register</button>
                  </div>
              </div>
          </div>
      </div>
      <HomeFooter />
      </div>
  );
}

export default DoctorLogin;