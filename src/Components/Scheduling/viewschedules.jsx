import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const response = await axios.get('http://localhost:98/api/Schedule/GetSchedules');
        const schedulesData = response.data;

        // Fetch airport names for source and destination airports
        const airportNamesPromises = schedulesData.map(async (schedule) => {
          const sourceAirportResponse = await axios.get(`http://localhost:98/api/Airport/${schedule.sourceAirportId}`);
          const destinationAirportResponse = await axios.get(`http://localhost:98/api/Airport/${schedule.destinationAirportId}`);

          const sourceAirportName = sourceAirportResponse.data.airportName;
          const destinationAirportName = destinationAirportResponse.data.airportName;

          return {
            ...schedule,
            sourceAirportName,
            destinationAirportName,
          };
        });

        // Fetch seats information for each schedule
        // const seatsPromises = schedulesData.map(async (schedule) => {
        //   const seatsResponse = await axios.get(`https://localhost:7200/api/Seat/${schedule.scheduleId}`);
        //   return {
        //     ...schedule,
        //     seats: seatsResponse.data,
        //   };
        // });

        const [schedulesWithAirports, schedulesWithSeats] = await Promise.all([
          Promise.all(airportNamesPromises),
          //Promise.all(seatsPromises),
        ]);

        // Combine airport names and seats information for each schedule
        const combinedSchedules = schedulesWithAirports.map((schedule) => ({
          ...schedule,
          //seats: schedulesWithSeats.find((seatSchedule) => seatSchedule.scheduleId === schedule.scheduleId)?.seats || [],
        }));

        setSchedules(combinedSchedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    }

    fetchSchedules();
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1>Schedule Flights</h1>
        <Link to="/admin/Scheduling/addschedule" className="btn btn-success mb-3">
          Schedule Flight
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Schedule ID</th>
              <th>Flight Name</th>
              <th>Source Airport</th>
              <th>Destination Airport</th>
              <th>Arrival Datetime</th>
              <th>Departure Datetime</th>
              <th>Duration</th>
        
              <th>Flight Status</th>
              {/* <th>Seats Available</th> */}
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.scheduleId}>
                <td>{schedule.scheduleId}</td>
                <td>{schedule.flightName}</td>
                <td>{schedule.sourceAirportName}</td>
                <td>{schedule.destinationAirportName}</td>
                <td>{schedule.dateTime}</td>
                <td>{calculateDepartureDateTime(schedule)}</td>
                <td>{schedule.flightDuration}</td>
                <td>{schedule.isActive ? 'Active' : 'Inactive'}</td>
                {/* <td>{calculateSeatsAvailable(schedule.seats)}</td> */}
                {/* <td>
                  <Link to={`/admin/Scheduling/editschedule/${schedule.scheduleId}`} className="btn btn-primary me-2">
                    Update
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(schedule.scheduleId)}>
                    Delete
                  </button>
                </td> */}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

// Function to calculate departure time based on arrival time and duration
const calculateDepartureDateTime = (schedule) => {
  const arrivalDateTime = new Date(schedule.dateTime);
  const flightDuration = parseFlightDuration(schedule.flightDuration);

  if (!isNaN(flightDuration)) {
    const durationInMillis = flightDuration * 1000; // Convert seconds to milliseconds
    const departureDateTime = new Date(arrivalDateTime.getTime() + durationInMillis);

    // Format options
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const formattedDepartureDateTime = departureDateTime.toLocaleString('en-GB', options); // Use 'en-GB' for dd/mm/yyyy format

    return formattedDepartureDateTime;
  }

  return '';
};



// Function to parse flight duration in seconds from hh:mm:ss format
const parseFlightDuration = (duration) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to calculate the number of available seats
const calculateSeatsAvailable = (seats) => {
    const availableSeats = seats.filter((seat) => seat.status === 'Available');
    const availableSeatNumbers = availableSeats.map((seat) => seat.seatNumber).join(', ');
    return availableSeatNumbers;
  };

export default Schedule;
