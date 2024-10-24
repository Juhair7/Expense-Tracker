import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleSignOut = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="nav-title">Expense Tracker</div> {/* Application title */}
      <ul className="nav-list"> {/* Apply nav-list class */}
        <li className="nav-item"><Link to="/dashboard" className="nav-link">Home</Link></li>
        <li className="nav-item"><Link to="/expense" className="nav-link">Expense</Link></li>
        <li className="nav-item"><Link to="/budget" className="nav-link">Budget</Link></li>
        <li className="nav-item"><Link to="/category" className="nav-link">Category</Link></li>
        <li className="nav-item"><Link to="/report" className="nav-link">Report</Link></li>
        <li className="nav-item">
          <button onClick={handleSignOut} className='signout-button'>Sign Out</button> {/* Apply signout-button class */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
