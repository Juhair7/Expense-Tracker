import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryThunk, clearCurrentCategory } from '../../redux/slices/categorySlice';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryEditForm.css'; 

const CategoryEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCategory } = useSelector((state) => state.categories);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    allocatedBudget: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    if (currentCategory) {
      setFormData({
        name: currentCategory.name,
        allocatedBudget: currentCategory.allocatedBudget,
        month: currentCategory.month,
        year: currentCategory.year,
      });
    }
    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [currentCategory, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCategoryThunk({ id, data: formData }));
    navigate('/category/list'); 
  };

  return (
    <div className="category-edit-main-container">
    <div className="category-edit-container">
      <h2 className="category-edit-title">Edit Category</h2>
      <form className="category-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name</label>
          <input
            className="category-edit-input"
            id="name"
            name="name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="allocatedBudget">Budget</label>
          <input
            className="category-edit-input"
            id="allocatedBudget"
            name="allocatedBudget"
            placeholder="Enter budget amount"
            value={formData.allocatedBudget}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <input
            className="category-edit-input"
            id="month"
            name="month"
            placeholder="Month"
            value={formData.month}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            className="category-edit-input"
            id="year"
            name="year"
            placeholder="Year"
            value={formData.year}
            readOnly
          />
        </div>
        <div className="category-edit-buttons">
          <button type="submit" className="update-button">Update</button>
          <button
            type="button"
            className="category-edit-cancel-button"
            onClick={() => navigate(-1)} 
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CategoryEditForm;
