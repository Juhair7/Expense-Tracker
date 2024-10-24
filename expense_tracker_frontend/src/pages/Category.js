import React from 'react';
import { Link } from 'react-router-dom';
import './Category.css'; // Ensure to import your CSS file

const CategoryPage = () => {
  return (
    <div className="category-container">
      <h1 className="category-title">Category Management</h1>
      <div className="category-buttons">
        <Link to="/category/add">
          <button className="category-button">Add Category</button>
        </Link>
        <Link to="/category/list">
          <button className="category-button">View Categories</button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;
