// ConfirmBooking.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout';
import { Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState([]);

  useEffect(() => {
    try {
      const bookingDataString = sessionStorage.getItem('bookingData');
      const selectedSeatsString = sessionStorage.getItem('selectedSeatsData');
      const bookingInfoString = sessionStorage.getItem('bookingInfo');
  
      if (!bookingDataString || !selectedSeatsString || !bookingInfoString) {
        toast.error('Invalid user details, selected seats, or booking info. Please try again.');
        navigate('/dashboard');
        return;
      }
  
      const bookingData = JSON.parse(bookingDataString);
      const selectedSeatsData = JSON.parse(selectedSeatsString);
      const bookingInfo = JSON.parse(bookingInfoString);
  
      const usersData = bookingData.users.map((user, index) => ({
        userId: bookingInfo.userId,
        scheduleId: bookingInfo.scheduleId,
        status: 'Booked',
        name: user.name,
        age: user.age,
        gender: user.gender,
        selectedSeats: [selectedSeatsData.selectedSeats[index]], // Assign only one seat
        bookingType: bookingData.bookingType,
      }));
  
      setConfirmationData(usersData);
    } catch (error) {
      console.error('Error processing data from session storage:', error);
      toast.error('Error processing data from session storage');
    }
  }, [navigate]);
  
  const handleSave = () => {
    try {
      const savedData = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationData[0].userId,
          bookingType: confirmationData[0].bookingType,
        },
        flightTickets: confirmationData.flatMap((confirmation) =>
          confirmation.selectedSeats.map((seat) => ({
            scheduleId: confirmation.scheduleId,
            name: confirmation.name,
            age: confirmation.age,
            gender: confirmation.gender,
            seatNo: seat,
          }))
        ),
      };
  
      // Remove duplicate flightTickets entries
      savedData.flightTickets = savedData.flightTickets.reduce((uniqueTickets, ticket) => {
        const existingTicket = uniqueTickets.find((t) => t.seatNo === ticket.seatNo);
        if (!existingTicket) {
          uniqueTickets.push(ticket);
        }
        return uniqueTickets;
      }, []);
  
      sessionStorage.setItem('savedData', JSON.stringify(savedData));
      toast.success('Data saved successfully in the desired format!');
    } catch (error) {
      console.error('Error saving data to session storage:', error);
      toast.error('Error saving data to session storage');
    }
  };
  

  const handleConfirm = async () => {
    try {
      // Prepare data for the API request
      const requestData = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationData[0].userId,
          bookingType: confirmationData[0].bookingType,
        },
        flightTickets: confirmationData.flatMap((user) =>
          user.selectedSeats.map((seat) => ({
            scheduleId: user.scheduleId,
            name: user.name,
            age: user.age,
            gender: user.gender,
            seatNo: seat,
          }))
        ),
      };

      // Use Axios to make the POST request with JWT token
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const createBookingResponse = await axios.post(
        'http://192.168.10.71:98/api/Booking/CreateBooking',
        requestData,
        {
          headers,
        }
      );

      if (!createBookingResponse.data || createBookingResponse.data.error) {
        throw new Error('Failed to create booking');
      }

      // Clear session storage after successful booking
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('selectedSeatsData');
      sessionStorage.removeItem('bookingInfo');
      sessionStorage.removeItem('savedData');
      sessionStorage.removeItem('numberOfPassengers');

      // Redirect to a success page or handle accordingly
      navigate('/dashboard/Tickets/tickets');
      toast.success('Ticket Booked Successfully');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking');
    }
  };


  const handleBack = () => {
    try {
      const bookingInfoString = sessionStorage.getItem('bookingInfo');
      if (!bookingInfoString) {
        toast.error('Invalid bookingInfo. Please try again.');
        return;
      }

      const bookingInfo = JSON.parse(bookingInfoString);

      // Check if scheduleId is available
      if (!bookingInfo || !bookingInfo.scheduleId) {
        toast.error('Invalid scheduleId. Please try again.');
        return;
      }

      // Navigate back to booking details page with the correct scheduleId
      navigate(`/Booking/seatbooking/${bookingInfo.scheduleId}`);
    } catch (error) {S
      console.error('Error navigating back:', error);
      toast.error('Error navigating back. Please try again.');
    }
  };

  // Render confirmation page with fetched data
  return (
    <Layout>
      <div className="container mt-4" style={{ width: '60vw' }}>
        <h2>Confirm Your Booking</h2>

        {/* Display user details in a table */}
        <table className="table">
          <thead>
            <tr>
              {/* <th>User ID</th>
              <th>Schedule ID</th> */}
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Selected Seats</th>
              <th>Booking Type</th>
            </tr>
          </thead>
          <tbody>
            {confirmationData.map((user, index) => (
              <tr key={index}>
                {/* <td>{user.userId}</td>
                <td>{user.scheduleId}</td> */}
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.selectedSeats.join(', ')}</td>
                <td>{user.bookingType}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-between">
          <Button variant="danger" onClick={handleBack}>
            Back
          </Button>
          <Button variant="secondary" className="mr-2" onClick={handleSave}>
            Save
          </Button>
          <Button variant="primary" className="mr-2" onClick={handleConfirm}>
            Confirm
          </Button>
          
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmBooking;
