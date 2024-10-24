import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesThunk, deleteCategoryThunk, getCategoryByIdThunk } from '../../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';
import './CategoryList.css'; 

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategoryThunk(id));
    }
  };

  const handleEdit = (id) => {
    dispatch(getCategoryByIdThunk(id));
    navigate(`/category/edit/${id}`); // Navigate to edit page
  };

  const handleView = (id) => {
    navigate(`/category/view/${id}`); // Navigate to view page
  };

  return (
    <div className="category-list-container">
      <h2 className="category-list-title">Category List</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Allocated Budget</th>
            <th>Remaining Budget</th>
            <th>Month</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>₹{category.allocatedBudget}</td>
              <td>₹{category.remainingBudget}</td>
              <td>{category.month}</td>
              <td>{category.year}</td>
              <td>
                <button className="action-button view-button" onClick={() => handleView(category.id)}>View</button>
                <button className="action-button edit-button" onClick={() => handleEdit(category.id)}>Edit</button>
                <button className="action-button delete-button" onClick={() => handleDelete(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
