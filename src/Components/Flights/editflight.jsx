import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function EditFlight() {
  const { id } = useParams();
  
  const [flight, setFlight] = useState({
    flightCapacity: 0,
    isActive: false,
  });

  useEffect(() => {
    async function fetchFlight() {
      try {
        const response = await axios.get(`https://localhost:7200/api/Flight/${id}`);
        setFlight(response.data);
      } catch (error) {
        console.error('Error fetching flight:', error);
      }
    }
  
    fetchFlight();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Use a conditional operator to handle different input types
    const updatedValue = type === 'checkbox' ? checked : value;

    setFlight({
      ...flight,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://localhost:7200/api/Flight/${id}`, flight);
      toast.success('Flight updated successfully');
      //navigate('/admin/Flights/Flights'); // Redirect to Flights page
    } catch (error) {
      console.error('Error updating flight:', error);
      toast.error('Error updating flight');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Edit Flight</h1>
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
            Update Flight
          </button>
        </form>

        <Link to="/admin/flights/flights" className="btn btn-warning mt-3">
          Back to Flights
        </Link>
      </div>
    </AdminLayout>
  );
}

export default EditFlight;
