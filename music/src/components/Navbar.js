import React from 'react';
import { useNavigate } from 'react-router-dom';

import Navigation from './Navbar/Navigation';
import User from './Navbar/User';
import LibFilter from './Navbar/LibFilter';

export default function Navbar() {
  const navigate = useNavigate();



  const libRoute = () => {
    navigate('/collection');
  };

  return (
    <nav className="h-[3.75rem] flex items-center justify-between px-8">
      <Navigation />
      <LibFilter onClick={libRoute} />
      <User />
    </nav>
  );
}
