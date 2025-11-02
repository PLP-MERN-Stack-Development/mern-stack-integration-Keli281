// src/components/SearchAndFilter.jsx
import React, { useState } from 'react';
import { useCategories } from '../context/CategoriesContext';

const SearchAndFilter = ({ onSearch, onFilter, currentFilters }) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters?.category || '');
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    onFilter(selectedCategory);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onSearch('');
    onFilter('');
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      margin: '20px 0', 
      borderRadius: '8px',
      backgroundColor: '#978585ff',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h4 style={{ textAlign: 'center', marginBottom: '15px', color: '#000' }}>
        Search & Filter Posts
      </h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
              Search Posts:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or content..."
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#000'
              }}
            >
              <option value="">All Categories</option>
              {!categoriesLoading && categories.map(category => (
                <option 
                  key={category._id} 
                  value={category._id}
                  style={{ color: '#000', backgroundColor: 'white' }}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', minWidth: '200px' }}>
            <button 
              type="submit"
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1'
              }}
            >
              Apply
            </button>
            <button 
              type="button"
              onClick={handleClear}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory) && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
            <span style={{ color: '#000', fontWeight: 'bold' }}>Active Filters: </span>
            {searchTerm && (
              <span style={{ color: '#000', margin: '0 10px' }}>
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && categories.find(cat => cat._id === selectedCategory) && (
              <span style={{ color: '#000', margin: '0 10px' }}>
                Category: {categories.find(cat => cat._id === selectedCategory)?.name}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchAndFilter;