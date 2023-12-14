import React, { useState, useEffect } from 'react';
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
      await axios.post('https://localhost:7200/api/Flight/Flightdetails', flight);
      toast.success('Flight added successfully');
      // After successful submission, clear the form fields
      setFlight({
        flightCapacity: 0,
        isActive: false,
      });
    } catch (error) {
      console.error('Error adding flight:', error);
      toast.error('Error adding flight');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Add Flight</h1>
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
    </AdminLayout>
  );
}

export default AddFlight;
