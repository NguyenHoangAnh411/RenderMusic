// TopSearch.js
import React, { useState, useEffect } from 'react';
import { Icon } from '../Icons';
import { useNavigate } from 'react-router-dom';

export default function TopSearch({ onUpdateSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedSearchQuery = localStorage.getItem('searchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }
  }, []);

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onUpdateSearch(query);
    localStorage.setItem('searchQuery', query);
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="mr-auto ml-4 relative">
      <label htmlFor="search-input" className="text-black w-12 h-10 flex items-center justify-center absolute top-0 left-0">
      </label>
      <input
        autoFocus={true}
        type="text"
        id="search-input"
        className="h-10 pl-12 outline-none text-black font-medium bg-white rounded-3xl text-sm placeholder-black/50 max-w-full w-[22.75rem]"
        placeholder="Search for artists, songs, or podcasts"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
      />
    </div>
  );
}
