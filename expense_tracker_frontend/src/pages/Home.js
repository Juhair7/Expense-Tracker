import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you will create a CSS file for styles

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1 className="welcome-text">Welcome to Your Personal Expense Tracker</h1>
        <p className="quote">"Managing your finances is the first step to financial freedom."</p>
        <p className="quote">"Track, budget, and take control of your expenses."</p>
        <p className="app-info">
          Our expense tracker helps you manage your finances effectively by categorizing expenses, setting budgets, and generating insightful reports to help you stay on top of your spending habits.
        </p>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-btn">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
