import React from 'react';
import { Link } from 'react-router-dom';
import './Report.css'; // Import the CSS file

const Report = () => {
  return (
    <div className="report-page-main-container">
      <div className="report-page-container">
        <h1 className="report-page-title">Report Overview</h1>
        <p className="report-page-description">
          This is where you will see financial reports and insights.
        </p>



        <h2 className="report-page-subtitle">Available Details in Reporrt</h2>
        <p className="report-page-info">
          You can get the following details in your reports:
        </p>
        <ul className="report-page-report-types">
          <li>1. Monthly Budget Report</li>
          <li>2. Expense Summary Report</li>
          <li>3. Category-wise Expense Analysis</li>
        </ul>

        <h2 className="report-page-subtitle">Get it Now</h2>
        <p className="report-page-instructions">
          The generated report will provide detailed insights into your financial activities for the selected period.
        </p>
        <ul className="report-page-report-types">
          <li>1. Download as a PDF file</li>
          <li>2. Send report as text to your registered email</li>
          <li>3. Send report as a PDF to your registered email</li>
        </ul>


        <Link to="/get/report">
          <button className="report-page-button">Get Report</button>
        </Link>
      </div>
    </div>
  );
};

export default Report;
