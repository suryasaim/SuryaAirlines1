import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const ConnectConfirmBooking = () => {
  const navigate = useNavigate();
  const [confirmationDataFirstSchedule, setConfirmationDataFirstSchedule] = useState([]);
  const [confirmationDataSecondSchedule, setConfirmationDataSecondSchedule] = useState([]);

  useEffect(() => {
    try {
      const numberOfPassengers = sessionStorage.getItem('numberOfPassengers');
      const selectedSeatsDataString = sessionStorage.getItem('selectedSeatsData');
      const bookingDataString = sessionStorage.getItem('bookingData');
      const bookingInfoString = sessionStorage.getItem('bookingInfo');

      if (!numberOfPassengers || !selectedSeatsDataString || !bookingDataString || !bookingInfoString) {
        toast.error('Invalid session storage data. Please try again.');
        navigate('/dashboard');
        return;
      }

      const numberOfPassengersInt = parseInt(numberOfPassengers, 10);
      const selectedSeatsData = JSON.parse(selectedSeatsDataString);
      const bookingData = JSON.parse(bookingDataString);
      const bookingInfo = JSON.parse(bookingInfoString);

      // First Schedule
      const usersDataFirstSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsFirstSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const scheduleId = bookingInfo.scheduleIds[0];

        return {
          userId: bookingInfo.userId,
          scheduleId: scheduleId,
          status: 'Booked',
          name: user.name,
          age: user.age,
          gender: user.gender,
          selectedSeats: [selectedSeats],
          bookingType: bookingData.bookingType,
        };
      });

      setConfirmationDataFirstSchedule(usersDataFirstSchedule);

      // Second Schedule
      const usersDataSecondSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsSecondSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const scheduleId = bookingInfo.scheduleIds[1];

        return {
          userId: bookingInfo.userId,
          scheduleId: scheduleId,
          status: 'Booked',
          name: user.name,
          age: user.age,
          gender: user.gender,
          selectedSeats: [selectedSeats],
          bookingType: bookingData.bookingType,
        };
      });

      setConfirmationDataSecondSchedule(usersDataSecondSchedule);

    } catch (error) {
      console.error('Error processing data from session storage:', error);
      toast.error('Error processing data from session storage');
    }
  }, [navigate]);

  const handleSave = () => {
    try {
      // Save logic for the first schedule
      const savedDataFirstSchedule = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationDataFirstSchedule[0]?.userId,
          bookingType: confirmationDataFirstSchedule[0]?.bookingType,
        },
        flightTickets: confirmationDataFirstSchedule.flatMap((confirmation) =>
          confirmation.selectedSeats.map((seat) => ({
            scheduleId: confirmation.scheduleId,
            name: confirmation.name,
            age: confirmation.age,
            gender: confirmation.gender,
            seatNo: seat,
          }))
        ),
      };
  
      // Remove duplicate flightTickets entries for the first schedule
      savedDataFirstSchedule.flightTickets = savedDataFirstSchedule.flightTickets.reduce(
        (uniqueTickets, ticket) => {
          const existingTicket = uniqueTickets.find((t) => t.seatNo === ticket.seatNo);
          if (!existingTicket) {
            uniqueTickets.push(ticket);
          }
          return uniqueTickets;
        },
        []
      );
  
      sessionStorage.setItem('savedDataFirstSchedule', JSON.stringify(savedDataFirstSchedule));
  
      // Save logic for the second schedule
      const savedDataSecondSchedule = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationDataSecondSchedule[0]?.userId,
          bookingType: confirmationDataSecondSchedule[0]?.bookingType,
        },
        flightTickets: confirmationDataSecondSchedule.flatMap((confirmation) =>
          confirmation.selectedSeats.map((seat) => ({
            scheduleId: confirmation.scheduleId,
            name: confirmation.name,
            age: confirmation.age,
            gender: confirmation.gender,
            seatNo: seat,
          }))
        ),
      };
  
      // Remove duplicate flightTickets entries for the second schedule
      savedDataSecondSchedule.flightTickets = savedDataSecondSchedule.flightTickets.reduce(
        (uniqueTickets, ticket) => {
          const existingTicket = uniqueTickets.find((t) => t.seatNo === ticket.seatNo);
          if (!existingTicket) {
            uniqueTickets.push(ticket);
          }
          return uniqueTickets;
        },
        []
      );
  
      sessionStorage.setItem('savedDataSecondSchedule', JSON.stringify(savedDataSecondSchedule));
  
      toast.success('Data saved successfully for both schedules in the desired format!');
    } catch (error) {
      console.error('Error saving data to session storage:', error);
      toast.error('Error saving data to session storage');
    }
  };
  

 

  const handleConfirm = async () => {
    try {
      // Confirm logic for the first schedule
      const requestDataFirstSchedule = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationDataFirstSchedule[0]?.userId,
          bookingType: confirmationDataFirstSchedule[0]?.bookingType,
        },
        flightTickets: confirmationDataFirstSchedule.flatMap((user) =>
          user.selectedSeats.map((seat) => ({
            scheduleId: user.scheduleId,
            name: user.name,
            age: user.age,
            gender: user.gender,
            seatNo: seat,
          }))
        ),
      };

      // Retrieve JWT token from localStorage
      const token = localStorage.getItem('authToken');

      // Use Axios to make the POST request for the first schedule
      const createBookingResponseFirstSchedule = await axios.post(
        'http://192.168.10.71:98/api/Booking/CreateBooking',
        requestDataFirstSchedule,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
        }
      );

      if (!createBookingResponseFirstSchedule.data || createBookingResponseFirstSchedule.data.error) {
        throw new Error('Failed to create booking for the first schedule');
      }

      // Clear session storage for the first schedule after successful booking
      sessionStorage.removeItem('savedDataFirstSchedule');

      // Confirm logic for the second schedule
      const requestDataSecondSchedule = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationDataSecondSchedule[0]?.userId,
          bookingType: confirmationDataSecondSchedule[0]?.bookingType,
        },
        flightTickets: confirmationDataSecondSchedule.flatMap((user) =>
          user.selectedSeats.map((seat) => ({
            scheduleId: user.scheduleId,
            name: user.name,
            age: user.age,
            gender: user.gender,
            seatNo: seat,
          }))
        ),
      };

      // Use Axios to make the POST request for the second schedule
      const createBookingResponseSecondSchedule = await axios.post(
        'http://192.168.10.71:98/api/Booking/CreateBooking',
        requestDataSecondSchedule,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
        }
      );

      if (!createBookingResponseSecondSchedule.data || createBookingResponseSecondSchedule.data.error) {
        throw new Error('Failed to create booking for the second schedule');
      }

      // Clear session storage for the second schedule after successful booking
      sessionStorage.removeItem('savedDataSecondSchedule');

      // Clear other session storage items
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('selectedSeatsData');
      sessionStorage.removeItem('bookingInfo');
      sessionStorage.removeItem('numberOfPassengers');

      // Redirect to a success page or handle accordingly
      navigate('/dashboard/Tickets/tickets');
      toast.success('Tickets Booked Successfully for both Flights');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking');
    }
  };


  const handleBack = () => {
    try {
      // Your existing back logic
      // ...

      navigate(`/ConnectBooking/connectseatbooking/${confirmationDataFirstSchedule[0]?.scheduleId}`);
    } catch (error) {
      console.error('Error navigating back:', error);
      toast.error('Error navigating back. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mt-4" style={{ width: '60vw' }}>
        <h2>Confirmation Page</h2>

        {/* Display user details for the first schedule in a table */}
        <h3>First Schedule</h3>
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
            {confirmationDataFirstSchedule.map((user, index) => (
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

        {/* Display user details for the second schedule in a table */}
        <h3>Second Flight</h3>
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
            {confirmationDataSecondSchedule.map((user, index) => (
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

export default ConnectConfirmBooking;
