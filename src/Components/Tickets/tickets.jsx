import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tickets = () => {
  const [ticketDetails, setTicketDetails] = useState([]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        // Get user id from local storage
        const userId = localStorage.getItem('userId');
  
        if (!userId) {
          console.error('User id not found in local storage');
          return;
        }

        // Get the token from local storage
        const token = localStorage.getItem('authToken');

        // Fetch ticket details using the FlightTicket API with authentication
        const response = await axios.get(`http://192.168.10.70:98/api/FlightTicket/flighttickets/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const tickets = response.data;
  
        // Fetch schedule details for each ticket
        const ticketDetailsWithSchedule = await Promise.all(
          tickets.map(async (ticket) => {
            const scheduleResponse = await axios.get(`http://192.168.10.70:98/api/Schedule/GetSchedules/${ticket.scheduleId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            const schedule = scheduleResponse.data;
  
            return { ...ticket, schedule };
          })
        );
  
        setTicketDetails(ticketDetailsWithSchedule);
      } catch (error) {
        toast.info('Session Expired Please Login again', error);
      }
    };

    fetchTicketDetails();
  }, []);

  // Group tickets by booking ID
  const groupedTickets = ticketDetails.reduce((groups, ticket) => {
    const bookingId = ticket.bookingId;
    if (!groups[bookingId]) {
      groups[bookingId] = [];
    }
    groups[bookingId].push(ticket);
    return groups;
  }, {});

  // Helper function to calculate destination time based on arrival time and flight duration
  const calculateDestinationTime = (arrivalTime, flightDuration) => {
    const arrivalDateTime = new Date(arrivalTime);
    const durationParts = flightDuration.split(':');
    const durationInSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] * 1;
    const destinationDateTime = new Date(arrivalDateTime.getTime() + durationInSeconds * 1000);
  
    return destinationDateTime;
  };

  // Helper function to handle ticket cancellation
  const cancelTicket = async (ticketNo, arrivalTime) => {
    try {
      const currentDateTime = new Date();
      const ticketArrivalDateTime = new Date(arrivalTime);
  
      // Check if the ticket can be canceled (arrival time is after 24 hours)
      if (ticketArrivalDateTime > currentDateTime.getTime() + 24 * 60 * 60 * 1000) {
        // Implement cancellation logic here
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(
          `http://192.168.10.70:98/api/FlightTicket/DeleteTicket/${ticketNo}`,
          null,  // You can send data if needed
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',  // Set content type to application/json
            },
          }
        );
        console.log(response.data); // Log the cancellation response
  
        // Reload ticket details after cancellation (you may want to fetch fresh data)
        // fetchTicketDetails();
  
        // Show success message
        toast.success('Ticket canceled successfully!', { autoClose: 3000 });
      } else {
        // Display a message to the user that ticket cancellation time has expired
        toast.error('Ticket cancellation time has expired.');
      }
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };
  
  // Helper function to handle booking cancellation
  const cancelBooking = async (bookingId, departureTime) => {
    try {
      const currentDateTime = new Date();
      const departureDateTime = new Date(departureTime);
  
      // Check if the booking can be canceled (departure time is after 24 hours)
      if (departureDateTime > currentDateTime.getTime() + 24 * 60 * 60 * 1000) {
        // Implement booking cancellation logic here
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(
          `http://192.168.10.70:98/api/Booking/DeleteBooking/${bookingId}`,
          null,  // You can send data if needed
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',  // Set content type to application/json
            },
          }
        );
        console.log(response.data); // Log the cancellation response
  
        // Reload ticket details after cancellation (you may want to fetch fresh data)
        // fetchTicketDetails();
  
        // Show success message
        toast.success('Booking canceled successfully!', { autoClose: 3000 });
      } else {
        // Display a message to the user that booking cancellation time has expired
        toast.error('Booking cancellation time has expired.');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };
  

// Sort booking IDs in descending order
const sortedBookingIds = Object.keys(groupedTickets).sort(
    (a, b) => Math.max(...groupedTickets[b].map(ticket => ticket.ticketNo)) - Math.max(...groupedTickets[a].map(ticket => ticket.ticketNo))
  );

  const formatDateTime = (dateTime) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };
  
    return new Date(dateTime).toLocaleString('en-US', options);
  };

  return (
    <Layout>
      <div>
        <h2>Booking History</h2>
        {sortedBookingIds.map((bookingId) => {
          const tickets = groupedTickets[bookingId];
          const departureDateTime = tickets[0].schedule.dateTime;
          const arrivalDateTime = calculateDestinationTime(departureDateTime, tickets[0].schedule.flightDuration);

          return (
            <div key={bookingId} className="card mb-3"style={{  borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
              <div className="card-header">Booking ID: {bookingId}</div>
              <div className="card-body">
                <div className="row">
                  {tickets.map((ticket) => (
                    <div key={ticket.ticketNo} className="col-md-4 mb-3">
                      <div className="card"style={{  borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}}>
                        <div className="card-body">
                          <h5 className="card-title">Ticket No: {ticket.ticketNo}</h5>
                          <p>Flight Name: {ticket.schedule.flightName}</p>
                          <p>Source Airport: {ticket.schedule.sourceAirportId}</p>
                          <p>Destination Airport: {ticket.schedule.destinationAirportId}</p>
                          <p>Arrival Time: {formatDateTime(ticket.schedule.dateTime)}</p>
                          <p>Destination Time: {formatDateTime(arrivalDateTime)}</p>
                          <p>Seat No: {ticket.seatNo}</p>
                          <p>Name: {ticket.name}</p>
                          <p>Age: {ticket.age}</p>
                          <p>Gender: {ticket.gender}</p>
                          <button
                            className="btn btn-danger"
                            onClick={() => cancelTicket(ticket.ticketNo, ticket.schedule.dateTime)}
                          >
                            Cancel Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-danger" onClick={() => cancelBooking(bookingId, groupedTickets[bookingId][0].schedule.dateTime)}>
                  Cancel Booking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Tickets;