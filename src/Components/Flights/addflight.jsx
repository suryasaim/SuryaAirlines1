import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function AddFlight() {
  const [flight, setFlight] = useState({
    flightCapacity: 0,
    isActive: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlight({
      ...flight,
      [name]: name === 'isActive' ? e.target.checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('authToken'); // Replace with the actual token
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the Content-Type header
      };
  
      await axios.post('http://192.168.10.70:98/api/Flight/Flightdetails', flight, { headers });
      toast.success('Flight added successfully');
      // After successful submission, clear the form fields
      setFlight({
        flightCapacity: 0,
        isActive: false,
      });
    } catch (error) {
      handleRequestError(error, 'Error adding flight');
    }
  };

  const handleRequestError = (error, defaultMessage) => {
    console.error('Request failed:', error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized, handle accordingly (e.g., redirect to login)
        toast.error('Unauthorized: Please log in.');
      } else {
        toast.error(`Request failed with status ${status}`);
      }
    } else {
      toast.error(defaultMessage);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-5" style={{ width: '40vw', height: '100vh' }}>
        <h3>Add Flight</h3>
       <div className="container mt-4 p-3 bg-white" style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}} >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="flightCapacity" className="form-label">
              Flight Capacity
            </label>
            <input
              type="number"
              className="form-control"
              id="flightCapacity"
              name="flightCapacity"
              value={flight.flightCapacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isActive"
              name="isActive"
              checked={flight.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isActive">
              Is Active
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Flight
          </button>
        </form>

        <Link to="/admin/flights/flights" className="btn btn-warning mt-3">
          View Flights
        </Link>
       </div> 
      </div>
    </AdminLayout>
  );
}

export default AddFlight;
