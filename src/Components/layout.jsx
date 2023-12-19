import React from 'react';
import NavBar from './navbar';
import Footer from './Footer';
import '@fortawesome/fontawesome-free/css/all.css';
function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {children}
      </div>
      <Footer/>
    </div>
  );
}

export default Layout;
