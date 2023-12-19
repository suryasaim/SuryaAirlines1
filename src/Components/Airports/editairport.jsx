import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

function EditAirport() {
  const { id } = useParams();
  
  const [airport, setAirport] = useState({
    airportId: '',
    city: '',
    airportName: '',
    state: '',
  });

  useEffect(() => {
    async function fetchAirport() {
      try {
        const response = await axios.get(`http://localhost:98/api/Airport/${id}`);
        setAirport(response.data);
      } catch (error) {
        console.error('Error fetching airport:', error);
      }
    }

    fetchAirport();
  }, [id]);

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
      await axios.patch(`http://localhost:98/api/Airport/${id}`, airport);
      toast.success('Airport updated successfully');
      //navigate('/admin/Airports/Airport'); // Redirect to Airports page
    } catch (error) {
      console.error('Error updating airport:', error);
      toast.error('Error updating airport');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Edit Airport</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="airportId" className="form-label">
              Airport ID
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
            Update Airport
          </button>
        </form>

        <Link to="/admin/Airports/Airport" className="btn btn-warning mt-3">
          Back to Airports
        </Link>
      </div>
    </AdminLayout>
  );
}

export default EditAirport;
