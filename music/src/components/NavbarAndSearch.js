import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navbar/Navigation';
import User from './Navbar/User';
import TopSearch from './Navbar/TopSearch';
import LibFilter from './Navbar/LibFilter';

export default function Navbar({ onUpdateSearch }) {
  const navigate = useNavigate();

  const libRoute = () => {
    navigate('/collection');
  };

  return (
    <nav className="h-[3.75rem] flex items-center justify-between px-8">
      <Navigation />
      <TopSearch onUpdateSearch={onUpdateSearch} />
      <LibFilter onClick={libRoute} />
      <User />
    </nav>
  );
}
