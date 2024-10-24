import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/AuthSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyOTP.css';

const VerifyOTP = ({ setIsAuth }) => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      alert('Session expired. Please log in again.');
      navigate('/login');
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { username, otp });
      const { token } = response.data;
      localStorage.setItem('token', token);
      dispatch(login({ user: username, token }));

      alert('Login successful!');

      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="verify-otp-container">
      <form className="verify-otp-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <input
          type="text"
          className="verify-otp-input-field"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="verify-otp-button">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
