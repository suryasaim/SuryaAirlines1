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
  const [sourceAirportId, setSourceAirportId] = useState('');
  const [destinationAirportId, setDestinationAirportId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableFlights, setAvailableFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCityNames() {
      try {
        const response = await axios.get('https://localhost:98/api/Airport');
        const airports = response.data;
        setCityNames(airports);
      } catch (error) {
        console.error('Error fetching airport data:', error);
      }
    }

    fetchCityNames();
  }, []);

  const handleSearch = async () => {
    try {
      console.log(sourceAirportId);
      console.log(destinationAirportId);
      console.log(cityNames);
  
      if (!sourceAirportId || !destinationAirportId) {
        toast.error('Invalid source or destination airport. Please try again.');
        return;
      }
  
      const formattedDate = selectedDate.toLocaleDateString('en-CA'); // Format date as 'YYYY-MM-DD'
  
      // Save search parameters in localStorage
      localStorage.setItem('flightSearchParameters', JSON.stringify({
        sourceAirportId,
        destinationAirportId,
        selectedDate: formattedDate,
      }));
  
      const directFlightResponse = await axios.get(
        `http://localhost:98/api/Integration/directflight/${sourceAirportId}/${destinationAirportId}/${formattedDate}`
      );
  
      if (directFlightResponse.data.length > 0) {
        // Direct flights found
        setAvailableFlights(directFlightResponse.data);
        // Save search results in localStorage
        localStorage.setItem('flightSearchResults', JSON.stringify(directFlightResponse.data));
      } else {
        const connectingFlightResponse = await axios.get(
          `http://localhost:98/api/Integration/connectingflight/${sourceAirportId}/${destinationAirportId}/${formattedDate}`
        );
  
        if (connectingFlightResponse.data.length > 0) {
          // Connecting flights found
          setAvailableFlights(connectingFlightResponse.data);
          // Save search results in localStorage
          localStorage.setItem('flightSearchResults', JSON.stringify(connectingFlightResponse.data));
        } else {
          toast.info('No flights found for the selected route and date.');
        }
      }
    } catch (error) {
      console.error('Error fetching available flights:', error);
      toast.error('Error fetching available flights');
    }
  };
  

  const handleBookNow = (scheduleId) => {
    const isAuthenticated = localStorage.getItem('userId') !== null;

    if (isAuthenticated) {
      const userId = localStorage.getItem('userId');
      sessionStorage.setItem('bookingInfo', JSON.stringify({ userId, scheduleId }));
      navigate(`/Booking/bookingdetails/${scheduleId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Find Flights</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="sourceAirport">Source Airport:</label>
            <select
              id="sourceAirport"
              className="form-control"
              value={sourceAirportId}
              onChange={(e) => setSourceAirportId(e.target.value)}
            >
              <option value="">Select Source Airport</option>
              {cityNames.map((airport, index) => (
                <option key={index} value={airport.airportId}>
                  {airport.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="destinationAirport">Destination Airport:</label>
            <select
              id="destinationAirport"
              className="form-control"
              value={destinationAirportId}
              onChange={(e) => setDestinationAirportId(e.target.value)}
            >
              <option value="">Select Destination Airport</option>
              {cityNames.map((airport, index) => (
                <option key={index} value={airport.airportId}>
                  {airport.city}
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
