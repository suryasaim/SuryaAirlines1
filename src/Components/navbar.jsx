import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NavBar() {
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('lastActivityTimestamp');
    localStorage.removeItem('userRole');
    localStorage.removeItem('flightSearchResults');
    localStorage.removeItem('authToken');
    localStorage.removeItem('flightSearchParameters');

  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: '#9ACD32' }}>
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          Surya Airlines
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* Use ms-auto to align to the right */}
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/Brandprice/Modelprice" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/Tickets/tickets" className="nav-link">
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
