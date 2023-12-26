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
        const response = await axios.get('http://192.168.10.71:98/api/Flight/GetFlightdetails');
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    }

    fetchFlights();
  }, []);

  const handleDelete = async (flightId) => {
    try {
      await axios.delete(`http://192.168.10.71:98/api/Flight/${flightId}`);
      const updatedFlights = flights.filter((flight) => flight.flightId !== flightId);
      setFlights(updatedFlights);
      toast.success('Flight deleted successfully');
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast.error('Error deleting flight');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Flights</h1>
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
                  <Link to={`/admin/flights/editflight/${flight.flightName}`} className="btn btn-primary me-2">
                    Update
                  </Link>
                  
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
