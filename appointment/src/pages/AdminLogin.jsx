import React, { useState } from 'react';
import "../styles/Login.css";

const AdminLogin = () => {
    const h1Style = { color: '#0094d4' };
    const overlayH1Style = { color: '#ffffff' };
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    const handleLogin = async () => {
        try {
        const url = new URL('https://railway-backend-production-a8c8.up.railway.app/adminlogin');
        url.searchParams.append('username', username);
        url.searchParams.append('password', password);

        const response = await fetch(url, {
            method: 'POST',
        });

        if (response.ok) {
            // Login successful
            setLoginError('');
            console.log('Login successful');
            window.location.href = `/adminhome/${username}`; // Redirect to the profile page
        } else {
            // Login failed
            const errorMessage = await response.text();
            setLoginError(errorMessage);
            console.log('Login failed:', errorMessage);
        }
        } catch (error) {
        console.error('Error during login:', error);
        setLoginError('An error occurred during login');
        }
    };

    return (
      <div className="container" id="container">
          <div className="form-container sign-in-container">
              <form action="#" id="signin-form">
                  <h1 style={h1Style}>Admin Login</h1>
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
                      <p>Request an Admin Account? <br />Contact us at support@docclickconnect.com</p>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default AdminLogin;