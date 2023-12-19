import React from 'react';
import Layout from './layout';
import FindFlight from './findflight';

function Dashboard() {
  // const bodyStyle = {
  //   margin: 0, // Remove default body margin
  // };

  // const backgroundImageStyle = {
  //   backgroundImage: 'url("https://c4.wallpaperflare.com/wallpaper/1017/525/123/the-sky-aviation-the-plane-background-wallpaper-preview.jpg")',
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  //   height: '90vh',
  //   width: '100vw',
  //   overflow: 'hidden', // Prevent overflow
  //   padding: 0, // Remove padding
  // };

  return (
    <Layout>
      {/* <div style={bodyStyle}> */}
        <div>
          <FindFlight />
        </div>
      {/* </div> */}
    </Layout>
  );
}

export default Dashboard;
