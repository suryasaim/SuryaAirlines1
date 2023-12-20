import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const IntegratedConfirmBooking = () => {
  const navigate = useNavigate();
  const [confirmationDataFirstSchedule, setConfirmationDataFirstSchedule] = useState([]);
  const [confirmationDataSecondSchedule, setConfirmationDataSecondSchedule] = useState([]);
  const [integratedconfirmationDataSecondSchedule, setIntegratedConfirmationDataSecondSchedule] = useState([]);
  useEffect(() => {
    try {
      const numberOfPassengers = sessionStorage.getItem('numberOfPassengers');
      const selectedSeatsDataString = sessionStorage.getItem('selectedSeatsData');
      const bookingDataString = sessionStorage.getItem('bookingData');
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');

      if (!numberOfPassengers || !selectedSeatsDataString || !bookingDataString || !integratedBookingInfoString) {
        toast.error('Invalid session storage data. Please try again.');
        navigate('/dashboard');
        return;
      }
      
      const numberOfPassengersInt = parseInt(numberOfPassengers, 10);
      const selectedSeatsData = JSON.parse(selectedSeatsDataString);
      const bookingData = JSON.parse(bookingDataString);
      const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
    
      // First Schedule
      const usersDataFirstSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsFirstSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const scheduleId = integratedBookingInfo.scheduleIds[0];
        
        return {
          userId: integratedBookingInfo.userId,
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


       // First integratedS chedule
       const usersDataFirstintegratedSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsFirstSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const flightName = integratedBookingInfo.flightnames[0];
        const sourceAirportId = integratedBookingInfo.sourceAirportIds[0];
        const destinationAirportId = integratedBookingInfo.destinationAirportIds[0];
        const airlineName = integratedBookingInfo.airlineNames[0];
        return {
          userId: integratedBookingInfo.userId,
          
          name: user.name,
          age: user.age,
          gender: user.gender,
          selectedSeats: [selectedSeats],
          flightName:flightName,
          flightName: flightName,
          sourceAirportId: sourceAirportId,
          destinationAirportId: destinationAirportId,
          airlineName: airlineName,
        };
      });

      setConfirmationDataFirstSchedule(usersDataFirstintegratedSchedule);

      // Second Schedule
      const usersDataSecondSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsSecondSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const scheduleId = integratedBookingInfo.scheduleIds[1];

        return {
          userId: integratedBookingInfo.userId,
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
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
      if (!integratedBookingInfoString) {
        toast.error('Invalid integratedBookingInfo. Please try again.');
        return;
      }
  
      const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
  
      if (!integratedBookingInfo || !integratedBookingInfo.apiPaths || integratedBookingInfo.apiPaths.length !== 2) {
        toast.error('Invalid apiPaths. Please try again.');
        return;
      }
  
      const confirmationDataArray = [confirmationDataFirstSchedule, confirmationDataSecondSchedule];
  
      for (let i = 0; i < 2; i++) {
        const confirmationData = confirmationDataArray[i];
        const apiPath = integratedBookingInfo.apiPaths[i];
  
        let apiUrl;
  
        if (apiPath === 'http://192.168.10.106:98/api/') {
          apiUrl = 'http://localhost:98/api/Booking/CreateBooking';
        } else {
          apiUrl = `${apiPath}/Integration/partnerbooking`;
        }
  
        const requestData = {
          booking: {
            bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            status: 'Booked',
            id: confirmationData[0]?.userId,
            bookingType: confirmationData[0]?.bookingType,
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


        const integratedrequestData = usersDataFirstintegratedSchedule.map(user => ({
            bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            ticketNo: 0, // You may need to adjust this based on your actual data
            name: user.name,
            age: user.age,
            gender: user.gender,
            seatNo: user.selectedSeats[0], // Assuming only one seat is selected
            flightName: user.flightName,
            sourceAirportId: user.sourceAirportId,
            destinationAirportId: user.destinationAirportId,
            airlineName: user.airlineName,
            dateTime: user.dateTime,
          }));
  
        const createBookingResponse = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!createBookingResponse.data || createBookingResponse.data.error) {
          throw new Error(`Failed to create booking for schedule ${i + 1}`);
        }
  
        sessionStorage.removeItem(`savedData${i === 0 ? 'First' : 'Second'}Schedule`);
      }
  
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('selectedSeatsData');
      sessionStorage.removeItem('integratedBookingInfo');
      sessionStorage.removeItem('numberOfPassengers');
  
      navigate('/dashboard');
      toast.success('Tickets Booked Successfully for both schedules');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking');
    }
  };
  

  const handleBack = () => {
    try {
      // Your existing back logic
      // ...

      navigate(`/IntegratedBooking/integratedseatbooking/${confirmationDataFirstSchedule[0]?.scheduleId}`);
    } catch (error) {
      console.error('Error navigating back:', error);
      toast.error('Error navigating back. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1>Confirmation Page</h1>

        {/* Display user details for the first schedule in a table */}
        <h2>First Schedule</h2>
        <table className="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Schedule ID</th>
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
                <td>{user.userId}</td>
                <td>{user.scheduleId}</td>
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
        <h2>Second Flight</h2>
        <table className="table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Schedule ID</th>
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
                <td>{user.userId}</td>
                <td>{user.scheduleId}</td>
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
          <Button variant="secondary" className="mr-2" onClick={handleSave}>
            Save
          </Button>
          <Button variant="primary" className="mr-2" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="danger" onClick={handleBack}>
            Back
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default IntegratedConfirmBooking;
