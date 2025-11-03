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
    <div className="fade-in card-hover" style={{ 
      padding: '25px', 
      margin: '20px auto', 
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 8px 25px rgba(116, 185, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      maxWidth: '1000px',
      width: '95%' // Added this line for better centering
    }}>
      <h4 style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        color: '#2d3436',
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Search & Filter Posts
      </h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap', 
          alignItems: 'end' 
        }}>
          {/* Search Input */}
          <div style={{ flex: '2', minWidth: '250px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '14px'
            }}>
              Search Posts:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or content..."
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                boxSizing: 'border-box',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
          </div>

          {/* Category Filter */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '14px'
            }}>
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#2d3436',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            >
              <option value="">All Categories</option>
              {!categoriesLoading && categories.map(category => (
                <option 
                  key={category._id} 
                  value={category._id}
                  style={{ color: '#2d3436', backgroundColor: 'white' }}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            minWidth: '200px',
            flexWrap: 'wrap'
          }}>
            <button 
              type="submit"
              className="btn-primary"
              style={{ 
                padding: '12px 20px',
                fontSize: '14px',
                flex: '1',
                minWidth: '80px'
              }}
            >
              Apply
            </button>
            <button 
              type="button"
              onClick={handleClear}
              className="btn-secondary"
              style={{ 
                padding: '12px 20px',
                fontSize: '14px',
                flex: '1',
                minWidth: '80px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory) && (
          <div style={{ 
            marginTop: '15px', 
            padding: '12px 16px', 
            backgroundColor: 'rgba(116, 185, 255, 0.1)', 
            borderRadius: '10px',
            border: '1px solid rgba(116, 185, 255, 0.2)'
          }}>
            <span style={{ 
              color: '#2d3436', 
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Active Filters: 
            </span>
            {searchTerm && (
              <span style={{ 
                color: '#2d3436', 
                margin: '0 10px',
                fontSize: '13px',
                background: 'rgba(116, 185, 255, 0.2)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && categories.find(cat => cat._id === selectedCategory) && (
              <span style={{ 
                color: '#2d3436', 
                margin: '0 10px',
                fontSize: '13px',
                background: 'rgba(116, 185, 255, 0.2)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
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