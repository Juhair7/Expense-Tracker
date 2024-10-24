import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal'; 
import 'react-toastify/dist/ReactToastify.css';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import VerifyOTP from './components/Auth/VerifyOTP';
import PasswordRecovery from './components/Auth/PasswordRecovery';
import VerifyRecoveryOTP from './components/Auth/VerifyRecoveryOTP';
import AddBudget from './components/Budget/AddBudget';
import GetBudgets from './components/Budget/GetBudgets';
import UpdateBudget from './components/Budget/UpdateBudget';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import Expense from './pages/Expense';
import Budget from './pages/Budget';
import Category from './pages/Category';
import Report from './pages/Report';
import GetBudgetById from './components/Budget/GetBudgetById';
import CategoryEditForm from './components/Categories/CategoryEditForm';
import CategoryForm from './components/Categories/CategoryForm';
import CategoryList from './components/Categories/CategoryList';
import Navbar from './components/Navbar';
import CategoryDetail from './components/Categories/CategoryDetail';
import AddExpense from './components/Expense/AddExpense';
import ExpenseList from './components/Expense/ExpenseList';
import ExpenseFilters from './components/Expense/ExpenseFilter';
import ExpenseView from './components/Expense/ExpenseView';
import EditExpense from './components/Expense/EditExpense';
import MonthlyReport from './components/Report/MonthlyReport';
import 'react-toastify/dist/ReactToastify.css';
import ExpensePrediction from './components/ExpensePrediction/ExpensePrediction';


Modal.setAppElement('#root');

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer />
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const hiddenNavbarPaths = ['/','/dashboard', '/login', '/signup', '/password-recovery', '/verify-otp', '/verify-recovery-otp'];

  return (
    <>
      {!hiddenNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/verify-recovery-otp" element={<VerifyRecoveryOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/category" element={<Category />} />
        <Route path="/report" element={<Report />} />
        <Route path="/budgets/create" element={<AddBudget />} />
        <Route path="/budgets" element={<GetBudgets />} />
        <Route path="/budgets/update/:id" element={<UpdateBudget />} />
        <Route path="/budgets/getbudget/:id" element={<GetBudgetById />} />
        <Route path="/category/add" element={<CategoryForm />} />
        <Route path="/category/edit/:id" element={<CategoryEditForm />} />
        <Route path="/category/list" element={<CategoryList />} />
        <Route path="/category/view/:id" element={<CategoryDetail />} />
        <Route path="/expense/add" element={<AddExpense />} />
        <Route path="/expense/list" element={<ExpenseList />} />
        <Route path="/expense/filter" element={<ExpenseFilters />} />
        <Route path="/expense/view/:id" element={<ExpenseView />} />
        <Route path="/expense/edit/:id" element={<EditExpense />} />
        <Route path="/get/report" element={<MonthlyReport />} />
        <Route path="/expense-prediction" element={<ExpensePrediction/>} />
      </Routes>
    </>
  );
};

export default App;
