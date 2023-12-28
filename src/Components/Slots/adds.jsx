import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tickets = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [connectingTicketDetails, setConnectingTicketDetails] = useState([]);

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

        // Fetch regular ticket details using the FlightTicket API with authentication
        const response = await axios.get(`http://192.168.10.71:98/api/FlightTicket/flighttickets/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const tickets = response.data;

        // Fetch schedule details for each regular ticket
        const ticketDetailsWithSchedule = await Promise.all(
          tickets.map(async (ticket) => {
            const scheduleResponse = await axios.get(`http://192.168.10.71:98/api/Schedule/GetSchedules/${ticket.scheduleId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            const schedule = scheduleResponse.data;

            return { ...ticket, schedule, type: 'regular' };
          })
        );

        setTicketDetails(ticketDetailsWithSchedule);
      } catch (error) {
        console.error('Error fetching regular ticket details:', error);
      }
    };

    const fetchConnectingTicketDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('User id not found in local storage');
          return;
        }

        const token = localStorage.getItem('authToken');

        // Fetch connecting ticket details using the ConnectionFlightTicket API with authentication
        const connectingTicketsResponse = await axios.get(
          `http://192.168.10.71:98/api/ConnectionFlightTicket/GetConnectionFlightTicketsByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const connectingTickets = connectingTicketsResponse.data;

        // Fetch schedule details for each connecting ticket
        const connectingTicketDetailsWithSchedule = await Promise.all(
          connectingTickets.map(async (connectingTicket) => {
            const bookingId = connectingTicket.bookingId;

            const connectingTicketDetailsResponse = await axios.get(
              `http://192.168.10.71:98/api/ConnectionFlightTicket/ByBooking/${bookingId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const connectingTicketDetails = connectingTicketDetailsResponse.data;

            return { ...connectingTicket, schedule: connectingTicketDetails.schedule, type: 'connecting' };
          })
        );

        const sortedConnectingTickets = connectingTicketDetailsWithSchedule.sort((a, b) => b.ticketNo - a.ticketNo);
        setConnectingTicketDetails(sortedConnectingTickets);
      } catch (error) {
        toast.info('Session Expired Please Login again', error);
      }
    };

    fetchTicketDetails();
    fetchConnectingTicketDetails();
  }, []);

  // Group regular tickets by booking ID
  const groupedTickets = ticketDetails.reduce((groups, ticket) => {
    const bookingId = ticket.bookingId;
    if (!groups[bookingId]) {
      groups[bookingId] = [];
    }
    groups[bookingId].push(ticket);
    return groups;
  }, {});

  // Group connecting tickets by booking ID
  const groupedConnectingTickets = connectingTicketDetails.reduce((groups, connectingTicket) => {
    const bookingId = connectingTicket.bookingId;
    if (!groups[bookingId]) {
      groups[bookingId] = [];
    }
    groups[bookingId].push(connectingTicket);
    return groups;
  }, {});

  // Merge regular and connecting tickets for each booking ID
  const mergedTickets = Object.keys(groupedTickets).map((bookingId) => {
    const regularTickets = groupedTickets[bookingId] || [];
    const connectingTickets = groupedConnectingTickets[bookingId] || [];
    return [...regularTickets, ...connectingTickets];
  });

  // Sort merged tickets by ticket number
  const sortedMergedTickets = mergedTickets.map((tickets) =>
    tickets.sort((a, b) => b.ticketNo - a.ticketNo)
  );

  // Helper function to calculate destination time based on arrival time and flight duration
  const calculateDestinationTime = (arrivalTime, flightDuration) => {
    const arrivalDateTime = new Date(arrivalTime);
    const durationParts = flightDuration.split(':');
    const durationInSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] * 1;
    const destinationDateTime = new Date(arrivalDateTime.getTime() + durationInSeconds * 1000);
  
    return destinationDateTime;
  };

  // Helper function to handle ticket cancellation
  const cancelTicket = async (ticketNo, arrivalTime, type) => {
    // ... (similar logic as in the Tickets component)
  };
  
  // Helper function to handle booking cancellation
  const cancelBooking = async (bookingId, departureTime, type) => {
    // ... (similar logic as in the Tickets component)
  };

  // Helper function to handle connecting ticket cancellation
  const cancelConnectingTicket = async (ticketNo, arrivalTime, type) => {
    // ... (similar logic as in the ConnectingTickets component)
  };

  // Helper function to format date and time
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
        <h2>Combined Tickets</h2>
        {sortedMergedTickets.map((tickets) => {
          const bookingId = tickets[0].bookingId;
  
          return (
            <div key={bookingId} className="card mb-3">
              <div className="card-header">Booking ID: {bookingId}</div>
              <div className="card-body">
                <div className="row">
                  {tickets.map((ticket) => (
                    <div key={ticket.ticketNo} className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Ticket No: {ticket.ticketNo}</h5>
                          <p>Flight Name: {ticket.schedule?.flightName || 'N/A'}</p>
                          <p>Source Airport: {ticket.schedule?.sourceAirportId || 'N/A'}</p>
                          <p>Destination Airport: {ticket.schedule?.destinationAirportId || 'N/A'}</p>
                          <p>Arrival Time: {formatDateTime(ticket.schedule?.dateTime) || 'N/A'}</p>
                          <p>Seat No: {ticket.seatNo || 'N/A'}</p>
                          <p>Name: {ticket.name || 'N/A'}</p>
                          <p>Age: {ticket.age || 'N/A'}</p>
                          <p>Gender: {ticket.gender || 'N/A'}</p>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              if (ticket.type === 'regular') {
                                cancelTicket(ticket.ticketNo, ticket.schedule?.dateTime, ticket.type);
                              } else if (ticket.type === 'connecting') {
                                cancelConnectingTicket(ticket.ticketNo, ticket.schedule?.dateTime, ticket.type);
                              }
                            }}
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
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    cancelBooking(bookingId, tickets[0].schedule?.dateTime, tickets[0].type);
                  }}
                >
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
