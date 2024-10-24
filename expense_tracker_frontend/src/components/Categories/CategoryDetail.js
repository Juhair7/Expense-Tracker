import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryByIdThunk } from '../../redux/slices/categorySlice';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryDetail.css'; 

const CategoryDetail = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCategory } = useSelector((state) => state.categories); 

  useEffect(() => {
    dispatch(getCategoryByIdThunk(id)); 
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' '); 
  };

  return (
    <div className="category-detail-container">
      <div className="category-detail-card">
        <h2 className="category-detail-title">Category Details</h2>
        {currentCategory ? (
          <div className="category-detail-content">
            <div className="category-detail-item"><strong>Name:</strong> {currentCategory.name}</div>
            <div className="category-detail-item"><strong>Allocated Budget:</strong>  ₹{currentCategory.allocatedBudget}</div>
            <div className="category-detail-item"><strong>Remaining Budget:</strong>  ₹{currentCategory.remainingBudget}</div>
            <div className="category-detail-item"><strong>Month:</strong> {currentCategory.month}</div>
            <div className="category-detail-item"><strong>Year:</strong> {currentCategory.year}</div>
            <div className="category-detail-item"><strong>Created At:</strong> {formatDate(currentCategory.createdAt)}</div>
            <div className="category-detail-item"><strong>Updated At:</strong> {formatDate(currentCategory.updatedAt)}</div>
            <button className="category-detail-close-button" onClick={() => navigate(-1)}>Close</button> {/* Close button */}
          </div>
        ) : (
          <p>Loading...</p> 
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
