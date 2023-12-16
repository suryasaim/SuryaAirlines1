import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function AdminNavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top"style={{ backgroundColor: '#87CEEB' }}>
      <div className="container">
        <Link to="/admindashboard" className="navbar-brand">
          SURYA AIRLINES Admin Dashboard
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
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item">
              <Link to="/admin/Airports/Airport" className="nav-link">
                Airports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/Flights/flights" className="nav-link">
                Flights
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/Scheduling/viewschedules" className="nav-link">
                Scheduling
              </Link>
            </li>
            
          </ul>
          <ul className="navbar-nav ms-auto"> {/* This is for right-aligned items */}
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavBar;
