// YourFooterComponent.jsx

import React from 'react';

const YourFooterComponent = () => {
  return (
    <footer className="bg-info fixed-bottom p-1">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p>Email: contact@suryaairlines.com</p>
          </div>
          
          <div className="footer-icons">
            {/* Add your social media icons or links here */}
            <i className="fab fa-twitter br-5 ml-5"></i>
            <i className="fab fa-facebook mr-5 ml-5"></i>
            <i className="fab fa-instagram br-5 ml-5"></i>
            {/* Add more icons as needed */}
          </div>
          <div>
            <p className="mb-0">&copy; {new Date().getFullYear()} SuryaAirlines. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default YourFooterComponent;
