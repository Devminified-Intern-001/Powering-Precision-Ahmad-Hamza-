import React, { useState, useEffect } from 'react';
import '../StyleSheet/SigninPage.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginComponent = () => {
  const navigate = useNavigate(); // Initialize history using useHistory hook
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Clear the error message when the user interacts with the form
  useEffect(() => {
    setError('');
  }, [email, password]);

  const handleSignIn = async () => {
    try {
      // Replace this with your actual authentication logic
      const response = await fetch('http://localhost:3001/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log(response); // Log the response for debugging

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user_name', data.user.user_name);
        // Successful authentication
        navigate('/Dashboard');
      } else {
        // Authentication failed, set error message
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="home-img">
      <div>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
        </Helmet>
      </div>
      <div className="main">
        <img src="./Images/Jazz-logo.png" alt="" />
        <div className="loginForm" style={{ border: '1px solid rgb(142, 135, 135)' }}>
          <div className="formHeader">
            <p>WELCOME</p>
          </div>
          <div className="formBody">
            <div className="loginIcon">
              <img src="/Images/LoginIcon.png" alt="LoginIcon" />
            </div>
            <div className="loginDetails">
              <div className="inputDetails">
                <div className="userLogo">
                  <img src="./Images/LoginIcon.png" alt="" />
                </div>
                <div className="inUsername">
                  <input
                    type="text"
                    placeholder="Enter Username @gmail.com"
                    style={{ margin: '0px' }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputDetails">
                <div className="userLogo">
                  <img src="./Images/security.png" alt="" />
                </div>
                <div className="inPassword">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Password"
                      style={{ margin: '0px' }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {showPassword ? (
                      <FaEye className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                      <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="btnLogin">
              <button onClick={handleSignIn}>Sign in</button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
