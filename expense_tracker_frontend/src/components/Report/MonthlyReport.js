import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import {
    fetchMonthlyReport,
    resetReport,
    fetchReportByMonthAndYear,
    fetchSummaryReport,
    downloadMonthlyReportPdf
} from '../../redux/slices/reportSlice';
import './MonthlyReport.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Generates an array of the last 10 years

const MonthlyReport = () => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(years[0]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { report, loading } = useSelector((state) => state.report);
    const handleFetchReport = () => {
        if (month) {  // Ensure a valid month is selected
            dispatch(fetchMonthlyReport({ month, year }));
            setIsModalOpen(true); // Open the modal when fetching starts
        } else {
            alert('Please select a valid month');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        dispatch(resetReport()); // Reset the report state when closing modal
    };

    const handleDownload = () => {
        dispatch(downloadMonthlyReportPdf({ month, year }));
        navigate(-1);
    };

    const handleSendReportAsPDF = () => {
        dispatch(fetchReportByMonthAndYear({ month, year }));
        // Optionally, you can add success/error handling here
    };

    const handleSendReportAsText = () => {
        dispatch(fetchSummaryReport({ month, year }));
        // Optionally, you can add success/error handling here
    };

    return (
        <div className="report-main-container">
            <div className="report-container">
                <h2 className="report-header">Monthly Budget Report</h2>
                <form className="report-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <label htmlFor="month">Month:</label>
                        <select
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                            className="report-input"
                        >
                            <option value="" disabled>Select Month</option>
                            {monthNames.map((name, index) => (
                                <option key={index} value={index + 1}>{name}</option> // Numeric month value
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="year">Year:</label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            className="report-input"
                        >
                            {years.map((yr) => (
                                <option key={yr} value={yr}>{yr}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleFetchReport} disabled={loading} className="fetch-button">
                        {loading ? 'Fetching...' : 'Fetch Report'}
                    </button>
                </form>

                {/* Modal to display the report */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Report Modal"
                    className="report-modal"
                    overlayClassName="report-modal-overlay"
                >
                    {report && (
                        <div className="report-content">
                            <h3 className="modal-header">Report for {monthNames[month - 1]} - {year}</h3>
                            <div className="report-summary">
                                <div className="summary-card">
                                    <h4>Total Spent</h4>
                                    <p> ₹{report.totalSpent}</p>
                                </div>
                                <div className="summary-card">
                                    <h4>Total Budget</h4>
                                    <p> ₹{report.totalBudget}</p>
                                </div>
                                <div className="summary-card">
                                    <h4>Remaining Budget</h4>
                                    <p> ₹{report.remainingBudget}</p>
                                </div>
                            </div>

                            <h4>Expenses</h4>
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Expense Name</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.expenses && report.expenses.length > 0 ? (
                                        report.expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{expense.expenseName}</td>
                                                <td> ₹{expense.amount}</td>
                                                <td>{expense.categoryName}</td>
                                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                                <td>{expense.description}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No expenses found for this report.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <h4>Categories</h4>
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Allocated Budget</th>
                                        <th>Remaining Budget</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.categories && report.categories.length > 0 ? (
                                        report.categories.map((category) => (
                                            <tr key={category.id}>
                                                <td>{category.name}</td>
                                                <td> ₹{parseFloat(category.allocatedBudget).toFixed(2)}</td>
                                                <td> ₹{parseFloat(category.remainingBudget).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No categories found for this report.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button onClick={closeModal} className="modal-button">Close</button>
                        <button onClick={handleDownload} className="modal-button">Download Report</button>
                        <button onClick={handleSendReportAsPDF} className="modal-button">Send Report as PDF</button>
                        <button onClick={handleSendReportAsText} className="modal-button">Send Report as Text</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default MonthlyReport;
