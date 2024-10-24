import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signup.css';
const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    email: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/register`, formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert("No response received from the server.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          className="signup-input-field"
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <div className="signup-password-container">
          <input
            className="signup-input-field"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span className="signup-eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <input
          className="signup-input-field"
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />
        <input
          className="signup-input-field"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <select
          className="signup-input-field"
          name="securityQuestion"
          onChange={handleChange}
          required
        >
          <option className="signup-input-option" value="" disabled selected>Select a Security Question</option>
          <option value="What is your pet's name?">What is your pet's name?</option>
          <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
          <option value="What was the name of your first school?">What was the name of your first school?</option>
          <option value="What is your favorite book?">What is your favorite book?</option>
          <option value="What city were you born in?">What city were you born in?</option>
          <option value="What is your nick name?">What is your nick name?</option>
        </select>

        <input
          className="signup-input-field"
          type="text"
          name="securityAnswer"
          placeholder="Security Answer"
          onChange={handleChange}
          required
        />

        <button className="signup-submit-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
