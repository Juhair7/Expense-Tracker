import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PasswordRecovery.css';

const PasswordRecovery = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/password-recovery', { username });
      alert('OTP sent! Please check your email.');

      navigate('/verify-recovery-otp', { state: { username } });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="recovery-container">
      <form onSubmit={handleSubmit} className="recovery-form">
        <h2>Password Recovery</h2>
        <p className="recovery-text">Enter your username to receive a password recovery OTP.</p>
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">Recover Password</button>
      </form>
    </div>
  );
};

export default PasswordRecovery;
