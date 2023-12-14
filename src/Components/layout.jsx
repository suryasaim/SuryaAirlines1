import React from 'react';
import NavBar from './navbar';

function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {children}
      </div>
    </div>
  );
}

export default Layout;
