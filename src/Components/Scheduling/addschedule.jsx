import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminLayout from '../adminlayout';

const ScheduleFlights = () => {
  const [flightNames, setFlightNames] = useState([]);
  const [airportNames, setAirportNames] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    flightName: '',
    sourceAirportId: '',
    destinationAirportId: '',
    arrivalDateTime: new Date(),
    flightDuration: '', // This field will be entered by the user in the format hh:mm:ss
    numberOfDays: 1, // New field for the number of days
    // Add other fields as needed
  });
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    
  
    axios.get('http://192.168.10.70:98/api/Flight/GetFlightdetails', { headers })
      .then(response => {
        
        setFlightNames(response.data);
      })
      .catch(error => console.error('Error fetching flight names:', error));
  
    axios.get('http://192.168.10.70:98/api/Airport', { headers })
      .then(response => {
        //console.log('Airport details response:', response.data);
        setAirportNames(response.data);
      })
      .catch(error => console.error('Error fetching airport names:', error));
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
  };

  const handleDateTimeChange = (name, date) => {
    setScheduleData({
      ...scheduleData,
      [name]: date,
    });
  };

  const calculateDepartureDateTime = () => {
    const arrivalDateTime = scheduleData.arrivalDateTime;
    const flightDuration = parseFlightDuration(scheduleData.flightDuration);
  
    if (!isNaN(flightDuration)) {
      const durationInMillis = flightDuration * 1000; // Convert seconds to milliseconds
      const departureDateTime = new Date(arrivalDateTime.getTime() + durationInMillis);
  
      const formattedDate = departureDateTime.toLocaleDateString('en-GB'); // Format as dd-mm-yyyy
      const formattedTime = departureDateTime.toLocaleTimeString('en-US', { hour12: false }); // Format as 24-hour time
  
      return `${formattedDate} ${formattedTime}`;
    }
  
    return null;
  };

  const parseFlightDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatFlightDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateTime) => {
    return dateTime.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const numberOfDays = parseInt(scheduleData.numberOfDays, 10);
  
      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(scheduleData.arrivalDateTime);
        currentDate.setDate(currentDate.getDate() + i);
  
        const token = localStorage.getItem('authToken'); // Replace with the actual token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
  
        // Convert flightName, sourceAirportId, and destinationAirportId to strings
        const requestData = {
          ...scheduleData,
          flightName: String(scheduleData.flightName),
          sourceAirportId: String(scheduleData.sourceAirportId),
          destinationAirportId: String(scheduleData.destinationAirportId),
          flightDuration: formatFlightDuration(parseFlightDuration(scheduleData.flightDuration)),
          dateTime: formatDateTime(currentDate),
        };
  
        // Include flightDuration in the API request
        await axios.post('http://192.168.10.70:98/api/Schedule/CreateSchedule', requestData, { headers });
      }
  
      toast.success('Flights scheduled successfully');
    } catch (error) {
      console.error('Error scheduling flights:', error);
      toast.info('Schedule Flight At least One Day Before');
    }
  };
  

  return (
    <AdminLayout>
      <div>
        <h2>Schedule Flights</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label htmlFor="flightName" className="form-label">Flight Name</label>
            <select
              className="form-select"
              id="flightName"
              name="flightName"
              value={scheduleData.flightName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Flight</option>
              {flightNames.map((flight) => (
                <option key={flight.flightName} value={flight.flightName}>
                  {flight.flightName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="sourceAirportId" className="form-label">Source Airport ID</label>
            <select
              className="form-select"
              id="sourceAirportId"
              name="sourceAirportId"
              value={scheduleData.sourceAirportId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Source Airport</option>
              {airportNames.map((airport) => (
                <option key={airport.airportId} value={airport.airportId}>
                  {airport.airportName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="destinationAirportId" className="form-label">Destination Airport ID</label>
            <select
              className="form-select"
              id="destinationAirportId"
              name="destinationAirportId"
              value={scheduleData.destinationAirportId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Destination Airport</option>
              {airportNames.map((airport) => (
                <option key={airport.airportId} value={airport.airportId}>
                  {airport.airportName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="arrivalDateTime" className="form-label">Arrival Date and Time</label>
            <DatePicker
              selected={scheduleData.arrivalDateTime}
              onChange={(date) => handleDateTimeChange('arrivalDateTime', date)}
              showTimeSelect
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              id="arrivalDateTime"
              name="arrivalDateTime"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="flightDuration" className="form-label">Flight Duration (hh:mm:ss)</label>
            <input
              type="text"
              className="form-control"
              id="flightDuration"
              name="flightDuration"
              value={scheduleData.flightDuration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="numberOfDays" className="form-label">Number of Days</label>
            <input
              type="number"
              className="form-control"
              id="numberOfDays"
              name="numberOfDays"
              value={scheduleData.numberOfDays}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="departureDateTime" className="form-label">Departure Date and Time</label>
            <input
              type="text"
              className="form-control"
              id="departureDateTime"
              name="departureDateTime"
              value={calculateDepartureDateTime() || ''}
              readOnly
            />
          </div>
          {/* ... Other form fields ... */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Schedule Flight</button>
          </div>
        </form>
        <div className="col-12 mt-3">
          <Link to="/admin/Scheduling/viewschedules" className="btn btn-warning">Back to Schedule</Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ScheduleFlights;
