// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import { fetchMonthlyReport } from '../redux/slices/reportSlice';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Dashboard.css';
// import 'chart.js/auto';

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { report = {}, loading, error } = useSelector((state) => state.report);
//   const [month] = useState(new Date().getMonth() + 1);
//   const [year] = useState(new Date().getFullYear());
//   const [enlargedChart, setEnlargedChart] = useState(null); // State to handle enlarged chart

//   useEffect(() => {
//     dispatch(fetchMonthlyReport({ month, year }));
//   }, [dispatch, month, year]);

//   useEffect(() => {
//     if (error) {
//       toast.error('Failed to load report data');
//     }
//   }, [error]);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }


//   const handleSignOut = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   // Default values handling
//   const totalMonthlyBudget = report?.totalMonthlyBudget || 0;
//   const totalSpent = report?.totalSpent || 0;
//   const remainingBudget = report?.remainingBudget || 0;
//   const totalMonthlyRemainingBudget = report?.totalMonthlyRemainingBudget || 0;
//   const totalBudget = report?.totalBudget || 0;
//   const expenses = report?.expenses || [];

//   // Bar chart data
//   const barData = {
//     labels: ['Budget', 'Spent', 'Remaining'],
//     datasets: [
//       {
//         label: 'Amount in ₹',
//         data: [totalMonthlyBudget, totalSpent, remainingBudget],
//         backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
//       },
//     ],
//   };

//   // Line chart data
//   const lineData = {
//     labels: expenses.map((expense) => new Date(expense?.date || null).toLocaleDateString() || 'N/A'),
//     datasets: [
//       {
//         label: 'Spending over time',
//         data: expenses.map((expense) => expense?.amount || 0),
//         borderColor: '#36a2eb',
//         fill: false,
//       },
//     ],
//   };

//   // Pie chart data
//   const pieData = {
//     labels: expenses.map((expense) => expense?.categoryName || 'N/A'),
//     datasets: [
//       {
//         label: 'Expense Distribution',
//         data: expenses.map((expense) => expense?.amount || 0),
//         backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#ffce56', '#ff6384', '#36a2eb'],
//       },
//     ],
//   };

//   const openModal = (chart) => {
//     setEnlargedChart(chart);
//   };

//   const closeModal = () => {
//     setEnlargedChart(null);
//   };

//   return (
//     <div className="dashboard-main-container">
//       <aside className="sidebar-navigation">
//         <div className="navigation-links-container">
//           <h2 className="dashboard-header-sidebar">Track Your Finances</h2>
//           <div className="info-section budgets">
//             <h3>Budgets</h3>
//             <p>Manage your budgets efficiently.</p>
//             <Link to="/budget">
//               <button className="dashboard-link-button">Go to Budgets</button>
//             </Link>
//           </div>
//           <div className="info-section expenses">
//             <h3>Expenses</h3>
//             <p>Track your expenses and control spending.</p>
//             <Link to="/expense">
//               <button className="dashboard-link-button">Go to Expenses</button>
//             </Link>
//           </div>
//           <div className="info-section categories">
//             <h3>Categories</h3>
//             <p>Categorize your expenses for better organization.</p>
//             <Link to="/category">
//               <button className="dashboard-link-button">Go to Categories</button>
//             </Link>
//           </div>
//           <div className="info-section reports">
//             <h3>Reports</h3>
//             <p>View insights and detailed financial reports.</p>
//             <Link to="/report">
//               <button className="dashboard-link-button">Go to Reports</button>
//             </Link>
//           </div>
//           <div className="info-section signout">
//             <h3>Sign Out</h3>
//             <p>Thank you for your support</p>
//             <button onClick={handleSignOut} className="dashboard-signout-button">Sign Out</button>
//           </div>
//         </div>
//       </aside>

//       <div className="dashboard-content">
//         <header>
//           <h1 className="dashboard-header">Expense Tracker</h1>
//         </header>

//         <div className="budget-info-section">
//           <h2>Budget Info</h2>
//           <div className="info-grid">
//             <div className="info-card">
//               <h3>Total Monthly Budget</h3>
//               <h4> ₹{totalMonthlyBudget}</h4>
//             </div>
//             <div className="info-card">
//               <h3>Remaining Monthly Budget</h3>
//               <h4> ₹{totalMonthlyRemainingBudget}</h4>
//             </div>
//             <div className="info-card">
//               <h3>Total Expense Spent</h3>
//               <h4> ₹{totalSpent}</h4>
//             </div>
//             <div className="info-card">
//               <h3>Total Categorywise Budget</h3>
//               <h4> ₹{totalBudget}</h4>
//             </div>
//             <div className="info-card">
//               <h3>Remaining Categorywise Budget</h3>
//               <h4> ₹{remainingBudget}</h4>
//             </div>
//           </div>
//         </div>

//         <div className="chart-info-section">
//           <h2>Charts</h2>
//           <div className="info-grid">
//             <div className="info-card" onClick={() => openModal(<Bar data={barData} />)}>
//               <h3>Budget vs. Spending</h3>
//               <Bar data={barData} />
//             </div>
//             <div className="info-card" onClick={() => openModal(<Line data={lineData} />)}>
//               <h3>Spending Trends</h3>
//               <Line data={lineData} />
//             </div>
//             <div className="info-card" onClick={() => openModal(<Pie data={pieData} />)}>
//               <h3>Expense Distribution</h3>
//               <Pie data={pieData} />
//             </div>
//           </div>
//         </div>

//         {/* Modal for enlarged chart */}
//         {enlargedChart && (
//           <div className="dashboard-modal">
//             <div className="dashboard-modal-content">
//               <span className="dashboard-close" onClick={closeModal}>
//                 &times;
//               </span>
//               {enlargedChart}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { fetchMonthlyReport } from '../redux/slices/reportSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import 'chart.js/auto';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { report = {}, loading, error } = useSelector((state) => state.report);
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());
  const [enlargedChart, setEnlargedChart] = useState(null); 

  useEffect(() => {
    dispatch(fetchMonthlyReport({ month, year }));
  }, [dispatch, month, year]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load report data');
    }
  }, [error]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Default values handling
  const totalMonthlyBudget = report?.totalMonthlyBudget || 0;
  const totalSpent = report?.totalSpent || 0;
  const remainingBudget = report?.remainingBudget || 0;
  const totalMonthlyRemainingBudget = report?.totalMonthlyRemainingBudget || 0;
  const totalBudget = report?.totalBudget || 0;
  const expenses = report?.expenses || [];

  const categoryMap = expenses.reduce((acc, expense) => {
    const { categoryName, amount } = expense;
    if (acc[categoryName]) {
      acc[categoryName] += amount;
    } else {
      acc[categoryName] = amount;
    }
    return acc;
  }, {});

  const categories = Object.keys(categoryMap);
  const categoryAmounts = Object.values(categoryMap);

  // Bar chart data
  const barData = {
    labels: ['Budget', 'Spent', 'Remaining'],
    datasets: [
      {
        label: 'Amount in ₹',
        data: [totalMonthlyBudget, totalSpent, remainingBudget],
        backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: expenses.map((expense) => new Date(expense?.date || null).toLocaleDateString() || 'N/A'),
    datasets: [
      {
        label: 'Spending over time',
        data: expenses.map((expense) => expense?.amount || 0),
        borderColor: '#36a2eb',
        fill: false,
      },
    ],
  };

  // Pie chart data with aggregated categories
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: 'Expense Distribution',
        data: categoryAmounts,
        backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#ffce56', '#ff6384', '#36a2eb'],
      },
    ],
  };

  const openModal = (chart) => {
    setEnlargedChart(chart);
  };

  const closeModal = () => {
    setEnlargedChart(null);
  };

  return (
    <div className="dashboard-main-container">
      <aside className="sidebar-navigation">
        <div className="navigation-links-container">
          <h2 className="dashboard-header-sidebar">Track Your Finances</h2>
          <div className="info-section budgets">
            <h3>Budgets</h3>
            <p>Manage your budgets efficiently.</p>
            <Link to="/budget">
              <button className="dashboard-link-button">Go to Budgets</button>
            </Link>
          </div>
          <div className="info-section expenses">
            <h3>Expenses</h3>
            <p>Track your expenses and control spending.</p>
            <Link to="/expense">
              <button className="dashboard-link-button">Go to Expenses</button>
            </Link>
          </div>
          <div className="info-section categories">
            <h3>Categories</h3>
            <p>Categorize your expenses for better organization.</p>
            <Link to="/category">
              <button className="dashboard-link-button">Go to Categories</button>
            </Link>
          </div>
          <div className="info-section reports">
            <h3>Reports</h3>
            <p>View insights and detailed financial reports.</p>
            <Link to="/report">
              <button className="dashboard-link-button">Go to Reports</button>
            </Link>
          </div>
          <div className="info-section signout">
            <h3>Sign Out</h3>
            <p>Thank you for your support</p>
            <button onClick={handleSignOut} className="dashboard-signout-button">Sign Out</button>
          </div>
        </div>
      </aside>

      <div className="dashboard-content">
        <header>
          <h1 className="dashboard-header">Expense Tracker</h1>
        </header>
        <div className="budget-info-section">
          <h2>Budget Info</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Total Monthly Budget</h3>
              <h4> ₹{totalMonthlyBudget}</h4>
            </div>
            <div className="info-card">
              <h3>Remaining Monthly Budget</h3>
              <h4> ₹{totalMonthlyRemainingBudget}</h4>
            </div>
            <div className="info-card">
              <h3>Total Expense Spent</h3>
              <h4> ₹{totalSpent}</h4>
            </div>
            <div className="info-card">
              <h3>Total Categorywise Budget</h3>
              <h4> ₹{totalBudget}</h4>
            </div>
            <div className="info-card">
              <h3>Remaining Categorywise Budget</h3>
              <h4> ₹{remainingBudget}</h4>
            </div>
          </div>
        </div>

        <div className="chart-info-section">
          <h2>Charts</h2>
          <div className="info-grid">
            <div className="info-card" onClick={() => openModal(<Bar data={barData} />)}>
              <h3>Budget vs. Spending</h3>
              <Bar data={barData} />
            </div>
            <div className="info-card" onClick={() => openModal(<Line data={lineData} />)}>
              <h3>Spending Trends</h3>
              <Line data={lineData} />
            </div>
            <div className="info-card" onClick={() => openModal(<Pie data={pieData} />)}>
              <h3>Expense Distribution</h3>
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        {/* Modal for enlarged chart */}
        {enlargedChart && (
          <div className="dashboard-modal">
            <div className="dashboard-modal-content">
              <span className="dashboard-close" onClick={closeModal}>
                &times;
              </span>
              {enlargedChart}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
