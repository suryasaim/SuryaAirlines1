import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function Airports() {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://192.168.10.71:98/api/Airport', { headers });

        setAirports(response.data);
      } catch (error) {
        handleRequestError(error, 'Error fetching airports');
      }
    };

    fetchAirports();
  }, []);

  const handleDelete = async (airportId) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://192.168.10.71:98/api/Airport/${airportId}`, { headers });

      const updatedAirports = airports.filter((airport) => airport.airportId !== airportId);
      setAirports(updatedAirports);

      toast.success('Airport deleted successfully');
    } catch (error) {
      handleRequestError(error, 'Error deleting airport');
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
      <div>
        <h2>Airports</h2>
        <Link to="/admin/airports/addairport" className="btn btn-success mb-3">
          Add Airport
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Airport Code</th>
              <th>City</th>
              <th>Airport Name</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport) => (
              <tr key={airport.airportId}>
                <td>{airport.airportId}</td>
                <td>{airport.city}</td>
                <td>{airport.airportName}</td>
                <td>{airport.state}</td>
                <td>
                  <Link to={`/admin/airports/editairport/${airport.airportId}`} className="btn btn-primary me-2">
                    Update
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(airport.airportId)}>
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

export default Airports;
