// ConnectingTickets.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConnectingTickets = () => {
  const [connectingTicketDetails, setConnectingTicketDetails] = useState([]);

  useEffect(() => {
    const fetchConnectingTicketDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('User id not found in local storage');
          return;
        }

        const token = localStorage.getItem('authToken');

        const connectingTicketsResponse = await axios.get(
          `http://192.168.10.71:98/api/ConnectionFlightTicket/GetConnectionFlightTicketsByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const connectingTickets = connectingTicketsResponse.data;

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

            return { ...connectingTicket, schedule: connectingTicketDetails.schedule };
          })
        );
        const sortedConnectingTickets = connectingTicketDetailsWithSchedule.sort((a, b) => b.ticketNo - a.ticketNo);
        setConnectingTicketDetails(connectingTicketDetailsWithSchedule);
      } catch (error) {
        toast.info('Session Expired Please Login again', error);
      }
    };

    fetchConnectingTicketDetails();
  }, []);
  
  const calculateDestinationTime = (arrivalTime, flightDuration) => {
    const arrivalDateTime = new Date(arrivalTime);
    const durationParts = flightDuration.split(':');
    const durationInSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] * 1;
    const destinationDateTime = new Date(arrivalDateTime.getTime() + durationInSeconds * 1000);
  
    return destinationDateTime;
  };
   

  
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

  const cancelConnectingTicket = async (bookingid, arrivalTime) => {
    try {
      const currentDateTime = new Date();
      const ticketArrivalDateTime = new Date(arrivalTime);
  
      if (ticketArrivalDateTime > currentDateTime.getTime() + 24 * 60 * 60 * 1000) {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(
          `http://192.168.10.71:98/api/Integration/cancelticketsinpartnerbooking/${bookingid}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        // Assuming the server responds with a success message
        console.log(response.data);
        toast.success('Connecting Ticket canceled successfully!', { autoClose: 3000 });
      } else {
        toast.error('Connecting Ticket cancellation time has expired.');
      }
    } catch (error) {
      console.error('Error canceling connecting ticket:', error);
    }
  };
  
  const cancelBooking = async (bookingid, departureTime) => {
    try {
      const currentDateTime = new Date();
      const bookingDepartureDateTime = new Date(departureTime);
  
      if (bookingDepartureDateTime > currentDateTime.getTime() + 24 * 60 * 60 * 1000) {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch(
          `http://192.168.10.71:98/api/Integration/cancelpartnerbooking/${bookingid}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(object)
        // Assuming the server responds with a success message
        console.log(response.data);
        toast.success('Booking canceled successfully!', { autoClose: 3000 });
      } else {
        toast.error('Booking cancellation time has expired.');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };
  

  const groupConnectingTickets = () => {
    const groupedConnectingTickets = {};
    connectingTicketDetails.forEach((connectingTicket) => {
      const bookingId = connectingTicket.bookingId;
      if (!groupedConnectingTickets[bookingId]) {
        groupedConnectingTickets[bookingId] = [];
      }
      groupedConnectingTickets[bookingId].push(connectingTicket);
    });
    return groupedConnectingTickets;
  };

  return (
    <Layout>
      <div>
        <h2>Partner Flight Tickets</h2>
        {Object.keys(groupConnectingTickets()).map((bookingId) => {
          const connectingTickets = groupConnectingTickets()[bookingId];

          return (
            <div key={bookingId} className="card mb-3">
              <div className="card-header">Booking ID: {bookingId}</div>
              <div className="card-body">
                <div className="row">
                  {connectingTickets.map((connectingTicket, index) => (
                    <div key={connectingTicket.ticketNo} className={`col-md-4 mb-3`}>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Ticket No: {connectingTicket.ticketNo}</h5>
                          <p>Flight Name: {connectingTicket.flightName || 'N/A'}</p>
                          <p>Source Airport: {connectingTicket.sourceAirportId || 'N/A'}</p>
                          <p>Destination Airport: {connectingTicket.destinationAirportId || 'N/A'}</p>
                          <p>
                            Arrival Time: {connectingTicket.dateTime ? formatDateTime(connectingTicket.dateTime) : 'N/A'}
                          </p>
                          <p>Seat No: {connectingTicket.seatNo || 'N/A'}</p>
                          <p>Name: {connectingTicket.name || 'N/A'}</p>
                          <p>Age: {connectingTicket.age || 'N/A'}</p>
                          <p>Gender: {connectingTicket.gender || 'N/A'}</p>
                          <button
                            className="btn btn-danger"
                            onClick={() => cancelConnectingTicket(connectingTicket.ticketNo, connectingTicket.dateTime)}
                          >
                            Cancel Partner Flight Ticket
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
                  onClick={() => cancelBooking(bookingId)}
                >
                  Cancel partner Flight Booking
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default ConnectingTickets;