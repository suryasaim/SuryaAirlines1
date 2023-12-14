import React from 'react';
import AdminNavBar from './adminnavbar';

function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavBar />
      <div className="container mt-4">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
