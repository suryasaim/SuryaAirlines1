import React from 'react';
import AdminLayout from './adminlayout';

const backgroundImageStyle = {
  backgroundImage: 'url("https://images6.alphacoders.com/133/thumb-1920-1334374.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh', // Adjust the height as needed
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function AdminDashboard() {
  return (
    <AdminLayout>
      <div style={backgroundImageStyle}>
        {/* Your admin dashboard content */}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
