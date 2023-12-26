import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function Airports() {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    async function fetchAirports() {
      try {
        const response = await axios.get('http://192.168.10.71:98/api/Airport');
        setAirports(response.data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    }

    fetchAirports();
  }, []);

  const handleDelete = async (airportId) => {
    try {
      await axios.delete(`http://192.168.10.71:98/api/Airport/${airportId}`);
      // After successful deletion, you can update the airport list or show a success message.
      // For example, you can fetch the updated list of airports.
      const updatedAirports = airports.filter((airport) => airport.airportId !== airportId);
      setAirports(updatedAirports);
      toast.success('Airport deleted successfully');
    } catch (error) {
      console.error('Error deleting airport:', error);
      toast.error('Error deleting airport');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Airports</h1>
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
