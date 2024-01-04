import React from 'react';
import AdminLayout from './adminlayout';

// const backgroundImageStyle = {
//   backgroundImage: 'url("https://images6.alphacoders.com/133/thumb-1920-1334374.png")',
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
//   height: '100vh', // Adjust the height as needed
//   width: '100vw',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mt-4 p-2 bg-white" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh', width: '90vw', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <iframe
          title="SuryaPowerBi"
          width="1140"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=1282b3f4-0318-42b1-be6a-86d05d215001&autoAuth=true&ctid=8399c1c2-9c1b-4d0d-97fb-e0cfed231878"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </AdminLayout>
  );
}


export default AdminDashboard;
