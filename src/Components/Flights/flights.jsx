import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function Flights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://192.168.10.71:98/api/Flight/GetFlightdetails', { headers });
        setFlights(response.data);
      } catch (error) {
        handleRequestError(error, 'Error fetching flights');
      }
    }

    fetchFlights();
  }, []);

  const handleDelete = async (flightId) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://192.168.10.71:98/api/Flight/${flightId}`, { headers });

      const updatedFlights = flights.filter((flight) => flight.flightId !== flightId);
      setFlights(updatedFlights);

      toast.success('Flight deleted successfully');
    } catch (error) {
      handleRequestError(error, 'Error deleting flight');
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
        <h2>Flights</h2>
        <Link to="/admin/Flights/addflight" className="btn btn-success mb-3">
          Add Flight
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Flight Name</th>
              <th>Flight Capacity</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.flightId}>
                <td>{flight.flightName}</td>
                <td>{flight.flightCapacity}</td>
                <td>{flight.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <Link to={`/admin/flights/editflight/${flight.flightId}`} className="btn btn-primary me-2">
                    Update
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(flight.flightId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Flights;
