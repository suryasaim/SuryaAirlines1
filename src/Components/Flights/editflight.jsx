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
        const token = localStorage.getItem('authToken'); // Replace with the actual token
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`http://192.168.10.70:98/api/Flight/${id}`, { headers });
        setFlight(response.data);
      } catch (error) {
        handleRequestError(error, 'Error fetching flight');
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
      const token = localStorage.getItem('authToken');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the Content-Type header
      };
  
      await axios.patch(`http://192.168.10.70:98/api/Flight/${id}`, flight, { headers });
      toast.success('Flight updated successfully');
      //navigate('/admin/Flights/Flights'); // Redirect to Flights page
    } catch (error) {
      handleRequestError(error, 'Error updating flight');
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
      <div className="container mt-5" style={{ width: '50vw', height: '100vh' }}>
        <h2>Edit Flight</h2>
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
