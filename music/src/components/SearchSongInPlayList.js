import React, { useState } from 'react';
import { Icon } from './Icons';
import './css/SearchSongInPlayList.css';

export default function SearchSongInPlayList({ onUpdateSearch }) {
  const [searchSonginPlaylistQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onUpdateSearch(query);
  };

  return (
    <div className="search-container">
      <input
        autoFocus={true}
        type="text"
        className="search-input"
        placeholder="Search for artists, songs"
        value={searchSonginPlaylistQuery}
        onChange={handleInputChange}
      />
      
    </div>
  );
}
