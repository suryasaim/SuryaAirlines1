// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

function FindFlights() {
  const [cityNames, setCityNames] = useState([]);
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableFlights, setAvailableFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCityNames() {
      try {
        const response = await axios.get('https://localhost:7200/api/Airport');
        const cities = response.data.map((airport) => airport.city);
        setCityNames(cities);
      } catch (error) {
        console.error('Error fetching city names:', error);
      }
    }

    fetchCityNames();
  }, []);

  const handleSearch = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const response = await axios.get(
        `https://localhost:7200/api/FindFlight/GetAvailableFlights?SourceCity=${sourceCity}&DestinationCity=${destinationCity}&Date=${formattedDate}`
      );

      setAvailableFlights(response.data);
    } catch (error) {
      console.error('Error fetching available flights:', error);
      toast.error('Error fetching available flights');
    }
  };

  const handleBookNow = (scheduleId) => {
    // Check if the user is authenticated (assumes you have implemented authentication)
    const isAuthenticated = localStorage.getItem('userId') !== null;
  
    if (isAuthenticated) {
      // If authenticated, store user ID and schedule ID in session storage
      const userId = localStorage.getItem('userId');
      sessionStorage.setItem('bookingInfo', JSON.stringify({ userId, scheduleId }));
  
      // Redirect to the booking details page with the schedule ID
      navigate(`/Booking/bookingdetails/${scheduleId}`);
    } else {
      // If not authenticated, navigate to the login page
      navigate('/login'); // Update '/login' with your actual login page route
    }
  };
  
  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Find Flights</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="sourceCity">Source City:</label>
            <select
              id="sourceCity"
              className="form-control"
              value={sourceCity}
              onChange={(e) => setSourceCity(e.target.value)}
            >
              <option value="">Select Source City</option>
              {cityNames.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="destinationCity">Destination City:</label>
            <select
              id="destinationCity"
              className="form-control"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            >
              <option value="">Select Destination City</option>
              {cityNames.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="departureDate">Departure Date:</label>
            <DatePicker
              id="departureDate"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-3">
          <button onClick={handleSearch} className="btn btn-primary">
            Search Flights
          </button>
        </div>
      </div>
      {availableFlights.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-3">Available Flights</h2>
          <div className="row">
            {availableFlights.map((flight) => (
              <div key={flight.scheduleId} className="col-md-12 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faPlane} className="mr-3" style={{ fontSize: '2em' }} />
                        <div>
                          <h5 className="card-title">{flight.flightName}</h5>
                          {/* Updated lines for "from" and "to" cities */}
                          <p className="card-text text-center">
                            <strong>{flight.sourceCity}</strong> to <strong>{flight.destinationCity}</strong>
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="card-text">
                          <strong>Date:</strong> {new Date(flight.departureTime).toLocaleDateString()}
                        </p>
                        <p className="card-text">
                          <strong>Time:</strong> {new Date(flight.departureTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleBookNow(flight.scheduleId)} className="btn btn-primary">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FindFlights;
