import React from 'react';
import AdminNavBar from './adminnavbar';
import Footer from './Footer';
import '@fortawesome/fontawesome-free/css/all.css';



function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavBar />
      <div className="container mt-4">
        {children}
      </div>
      <Footer/>
    </div>
  );
}

export default AdminLayout;
