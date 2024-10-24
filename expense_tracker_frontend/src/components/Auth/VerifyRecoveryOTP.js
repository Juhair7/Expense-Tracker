import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './VerifyRecoveryOTP.css';

const VerifyRecoveryOTP = () => {
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      const fetchedUsername = location.state?.username || '';
      setUsername(fetchedUsername);

      try {

        const response = await axios.post('http://localhost:5000/api/auth/get-security-question', { username: fetchedUsername });
        setSecurityQuestion(response.data.securityQuestion);
      } catch (error) {
        alert('Failed to fetch security question. Please try again.');
      }
    };

    fetchSecurityQuestion();
  }, [location.state?.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/verify-recovery-otp', {
        username,
        otp,
        securityAnswer,
        newPassword,
      });
      alert('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="recovery-otp-container">
      <form className="recovery-otp-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="text"
          value={username}
          readOnly
          className="otp-input-field"
          placeholder="Username"
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="otp-input-field"
          required
        />

        <input
          type="text"
          value={securityQuestion}
          readOnly
          className="otp-input-field"
          placeholder="Security Question"
          required
        />
        <input
          type="text"
          placeholder="Security Answer"
          onChange={(e) => setSecurityAnswer(e.target.value)}
          className="otp-input-field"
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            className="otp-input-field"
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <button type="submit" className="recovery-otp-button">Reset Password</button>
      </form>
    </div>
  );
};

export default VerifyRecoveryOTP;
