import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';


function AddAirport() {
  const [airport, setAirport] = useState({
    airportId: '',
    city: '',
    airportName: '',
    state: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirport({
      ...airport,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://192.168.10.71:98/api/Airport', airport);
      // After successful submission, clear the form fields
      setAirport({
        airportId: '',
        city: '',
        airportName: '',
        state: '',
      });
      toast.success('Airport added successfully');
    } catch (error) {
      console.error('Error adding airport:', error);
      toast.error('Error adding airport');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Add Airport</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="airportId" className="form-label">
              Airport Code
            </label>
            <input
              type="text"
              className="form-control"
              id="airportId"
              name="airportId"
              value={airport.airportId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={airport.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="airportName" className="form-label">
              Airport Name
            </label>
            <input
              type="text"
              className="form-control"
              id="airportName"
              name="airportName"
              value={airport.airportName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="state"
              name="state"
              value={airport.state}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Airport
          </button>
        </form>

        <Link to="/admin/Airports/Airport" className="btn btn-warning mt-3">
          View Airports
        </Link>
      </div>
    </AdminLayout>
  );
}

export default AddAirport;
