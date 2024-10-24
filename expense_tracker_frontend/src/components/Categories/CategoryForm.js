import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategoryThunk } from '../../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';
import './CategoryForm.css'; // Import the CSS file

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '', // Change 'category' to 'name' for backend
    allocatedBudget: '',
    month: '',
    year: new Date().getFullYear(), // Set current year
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCategoryThunk(formData)); 
    setFormData({ name: '', allocatedBudget: '', month: '', year: new Date().getFullYear() }); 
  };

  return (
    <div className="category-form-container">
      <div className="category-form-card">
        <h1 className="category-form-title">Create Category</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <label htmlFor="name" className="category-form-label">Category</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="category-form-input"
          >
            <option value="" disabled>Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Medicine">Medicine</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent</option>
            <option value="Savings">Savings</option>
            <option value="Others">Others</option>
          </select>

          <label htmlFor="allocatedBudget" className="category-form-label">Allocated Budget</label>
          <input
            name="allocatedBudget"
            placeholder="Budget"
            value={formData.allocatedBudget}
            onChange={handleChange}
            required
            className="category-form-input"
          />

          <label htmlFor="month" className="category-form-label">Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="category-form-input"
          >
            <option value="" disabled>Select a month</option>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>

          <label htmlFor="year" className="category-form-label">Year</label>
          <input
            name="year"
            value={formData.year}
            readOnly
            className="category-form-input readonly-input"
          />

          <div className="category-form-buttons">
            <button type="submit" className="create-category-button">Create</button>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
