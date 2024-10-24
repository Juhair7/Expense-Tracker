import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/AuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token } = response.data;


      localStorage.setItem('username', credentials.username);


      dispatch(login({ user: credentials.username, token }));

      alert('OTP sent! Please check your email.');


      navigate('/verify-otp', { state: { username: credentials.username } });

    } catch (error) {
      console.log('Error Object:', error);
      if (error.response) {
        console.log('Error Response:', error.response);
        alert(error.response.data?.message || 'An error occurred on the server. Please try again.');
      } else if (error.request) {
        console.log('Error Request:', error.request);
        alert('No response received from the server. Please check your network connection.');
      } else {
        console.log('Error Message:', error.message);
        alert('Error in setting up the request: ' + error.message);
      }
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="login-input-field"
            onChange={handleChange}
            required
          />
          <div className="password-field-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="login-input-field"
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="links-container">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="link">Sign up here</Link>
          </p>
          <p>
            Forgot your password?{' '}
            <Link to="/password-recovery" className="link">Recover it here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
