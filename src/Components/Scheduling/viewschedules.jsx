import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';


const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true); 
  const perPage = 20;

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const token = localStorage.getItem('authToken'); // Replace with the actual token
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://192.168.10.70:98/api/Schedule/GetSchedules', { headers });
        const schedulesData = response.data;

        // Fetch airport names for source and destination airports
        const airportNamesPromises = schedulesData.map(async (schedule) => {
          const sourceAirportResponse = await axios.get(`http://192.168.10.70:98/api/Airport/${schedule.sourceAirportId}`, { headers });
          const destinationAirportResponse = await axios.get(`http://192.168.10.70:98/api/Airport/${schedule.destinationAirportId}`, { headers });

          const sourceAirportName = sourceAirportResponse.data.airportName;
          const destinationAirportName = destinationAirportResponse.data.airportName;

          return {
            ...schedule,
            sourceAirportName,
            destinationAirportName,
          };
        });

        const [schedulesWithAirports] = await Promise.all([
          Promise.all(airportNamesPromises),
        ]);

        setSchedules(schedulesWithAirports);
        setLoading(false);
      } catch (error) {
        
        console.error('Error fetching schedules:', error);
        setLoading(false); 
        toast.error('Error fetching schedules');
      }
    }

    fetchSchedules();
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const paginatedSchedules = schedules.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );
  
  return (
    <AdminLayout>
      <div  >
        <h2>Flight Schedules</h2>
        <Link to="/admin/Scheduling/addschedule" className="btn btn-success mb-3">
          Schedule Flight
        </Link>
        {/* Display loading spinner */}
        

        <table className="table"style={{  borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}} >
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
            </tr>
          </thead>
          <tbody>
            {paginatedSchedules.map((schedule) => (
              <tr key={schedule.scheduleId}>
                <td>{schedule.scheduleId}</td>
                <td>{schedule.flightName}</td>
                <td>{schedule.sourceAirportName}</td>
                <td>{schedule.destinationAirportName}</td>
                <td>{schedule.dateTime}</td>
                <td>{calculateDepartureDateTime(schedule)}</td>
                <td>{schedule.flightDuration}</td>
                <td>{schedule.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div className="container mt-4  bg-white" style={{ width: '38vw', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(schedules.length / perPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination justify-content-center bg-white p-2 '} // Bootstrap class for centering
          activeClassName={'active'}
          pageLinkClassName={'btn btn-outline-warning m-auto'} // Bootstrap class for button styling
          previousLinkClassName={'btn btn-outline-success '} // Bootstrap class for button styling
          nextLinkClassName={'btn btn-outline-success'} // Bootstrap class for button styling
        />
        </div>
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
