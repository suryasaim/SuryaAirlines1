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
  const [integratedConfirmationDataFirstSchedule, setIntegratedConfirmationDataFirstSchedule] = useState([]);
  const [integratedConfirmationDataSecondSchedule, setIntegratedConfirmationDataSecondSchedule] = useState([]);
  const [confirmationSeatsDataFirstSchedule, setConfirmationSeatsDataFirstSchedule] = useState([]);
  const [confirmationSeatsDataSecondSchedule, setConfirmationSeatsDataSecondSchedule] = useState([]);
  useEffect(() => {
    try {
      const numberOfPassengers = sessionStorage.getItem('numberOfPassengers');
      const selectedSeatsDataString = sessionStorage.getItem('selectedSeatsData');
      const bookingDataString = sessionStorage.getItem('bookingData');
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');

      if (!numberOfPassengers || !selectedSeatsDataString || !bookingDataString || !integratedBookingInfoString) {
        toast.error('Invalid session storage data. Please try again.');
        navigate('/IntegratedBooking/integratedseatbooking/${confirmationDataFirstSchedule[0]?.scheduleId}');
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

      

     //console.log(usersDataFirstSchedule)

     
      /////////////////////////////////////////////////////////////////////////////
      //first schedule seats
     const selectedSeatsFirstSchedule = bookingData.users.map((user, index) => {
      const selectedSeatsKey = 'selectedSeatsFirstSchedule';
      const selectedSeats = selectedSeatsData[selectedSeatsKey][index];  // Fix the typo here
      const scheduleId = integratedBookingInfo.scheduleIds[0];
    
      return {
        scheduleId: scheduleId,
        selectedSeats: [selectedSeats],
      };
    });
    
    // Save the selected seats and scheduleId for the first schedule
    setConfirmationSeatsDataFirstSchedule(selectedSeatsFirstSchedule);
    //console.log(selectedSeatsFirstSchedule);
     
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
      //console.log(usersDataSecondSchedule)  
      //secondscheduleseats
      const selectedSeatsSecondSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsSecondSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const scheduleId = integratedBookingInfo.scheduleIds[1]; // Use index 1 for the second schedule
      
        return {
          scheduleId: scheduleId,
          selectedSeats: [selectedSeats],
        };
      });
      
      // Save the selected seats and scheduleId for the second schedule
      setConfirmationSeatsDataSecondSchedule(selectedSeatsSecondSchedule);
      //console.log(selectedSeatsSecondSchedule);
     // First integratedS chedule
       const usersDataFirstintegratedSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsFirstSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const flightNames = integratedBookingInfo.flightNames[0];
        const sourceId = integratedBookingInfo.sourceIds[0];
        const destinationId = integratedBookingInfo.destinationIds[0];
        const airlineNames = integratedBookingInfo.airlineNames[0];
        const dateTimes=integratedBookingInfo.dateTimes[0];
        return {
          
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          ticketNo: '57',
          name: user.name,
          age: user.age,
          gender: user.gender,
          selectedSeats: [selectedSeats],
          flightNames: flightNames,
          sourceId: sourceId,
          destinationId: destinationId,
          airlineNames: airlineNames,
          dateTimes:dateTimes,
        };
      });

      
      setIntegratedConfirmationDataFirstSchedule(usersDataFirstintegratedSchedule);
      //console.log(usersDataFirstintegratedSchedule)
      
      // second integrated Schedule
      const usersDataSecondintegratedSchedule = bookingData.users.map((user, index) => {
        const selectedSeatsKey = 'selectedSeatsSecondSchedule';
        const selectedSeats = selectedSeatsData[selectedSeatsKey][index];
        const flightNames = integratedBookingInfo.flightNames[0];
        const sourceId = integratedBookingInfo.sourceIds[0];
        const destinationId = integratedBookingInfo.destinationIds[0];
        const airlineNames = integratedBookingInfo.airlineNames[0];
        const dateTimes=integratedBookingInfo.dateTimes[0];
        return {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          ticketNo: '57',
          name: user.name,
          age: user.age,
          gender: user.gender,
          selectedSeats: [selectedSeats],
          flightNames: flightNames,
          sourceId: sourceId,
          destinationId: destinationId,
          airlineNames: airlineNames,
          dateTimes:dateTimes,
        };
      });

      setIntegratedConfirmationDataSecondSchedule(usersDataSecondintegratedSchedule);
      //console.log(usersDataSecondintegratedSchedule)
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

    const savedDataFirstIntegratedSchedule = integratedConfirmationDataFirstSchedule.flatMap((confirmation) =>
      confirmation.selectedSeats.map((seat) => ({
        bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        ticketNo: 57,
        name: confirmation.name,
        age: confirmation.age,
        gender: confirmation.gender,
        seatNo: seat,
        flightName: confirmation.flightNames,
        sourceAirportId: confirmation.sourceId,
        destinationAirportId: confirmation.destinationId,
        airlineName: confirmation.airlineNames,
        dateTime: confirmation.dateTimes,
        
      }))
    );

    sessionStorage.setItem('savedDataFirstIntegratedSchedule', JSON.stringify(savedDataFirstIntegratedSchedule));

    // Save logic for the second integrated schedule
    const savedDataSecondIntegratedSchedule = integratedConfirmationDataSecondSchedule.flatMap((confirmation) =>
      confirmation.selectedSeats.map((seat) => ({
        bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        ticketNo: 57,
        name: confirmation.name,
        age: confirmation.age,
        gender: confirmation.gender,
        seatNo: seat,
        flightName: confirmation.flightNames,
        sourceAirportId: confirmation.sourceId,
        destinationAirportId: confirmation.destinationId,
        airlineName: confirmation.airlineNames,
        dateTime: confirmation.dateTimes,
      }))
    );

    sessionStorage.setItem('savedDataSecondIntegratedSchedule', JSON.stringify(savedDataSecondIntegratedSchedule));
     //console.log(savedDataSecondIntegratedSchedule)
      toast.success('Data saved successfully !');
    } catch (error) {
      console.error('Error saving data to session storage:', error);
      toast.error('Error saving data to session storage');
    }
  };

//////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////
  const handleConfirm = async () => {
      const integratedBookingInfo = JSON.parse(sessionStorage.getItem('integratedBookingInfo'));
      const token = localStorage.getItem('authToken');
      const status = "Booked"
    //console.log(confirmationSeatsDataFirstSchedule)
    const firstFlightSeats = confirmationSeatsDataFirstSchedule.map((schedule)=>{
      return schedule.selectedSeats
    })
    
    //console.log(firstFlightSeats.flat())


    //console.log(confirmationSeatsDataSecondSchedule)
    const secondFlightSeats = confirmationSeatsDataSecondSchedule.map((schedule)=>{
      return schedule.selectedSeats
    })

    //console.log(secondFlightSeats.flat());


    try {
      const sendDataResponse = await axios.patch(
        `${integratedBookingInfo.apiPaths[0]}Integration/changeseatstatus/${confirmationSeatsDataFirstSchedule[0].scheduleId}/${status}`,
        firstFlightSeats.flat(),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
          },
        }
      );

     // console.log('Response from sending data to API:', sendDataResponse);
      
      // Handle the response as needed
    } catch (error) {
      console.error('Error sending data to API:', error);
      throw error; // Rethrow the error to handle it later
    }

    try {
      const sendDataResponse = await axios.patch(
        `${integratedBookingInfo.apiPaths[1]}Integration/changeseatstatus/${confirmationSeatsDataSecondSchedule[0].scheduleId}/${status}`,
        secondFlightSeats.flat(),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
          },
        }
      );

     // console.log('Response from sending data to API:', sendDataResponse);
      
      // Handle the response as needed
    } catch (error) {
      console.error('Error sending data to API:', error);
      throw error; // Rethrow the error to handle it later
    }
    try {
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
      if (!integratedBookingInfoString) {
        toast.error('Invalid bookingInfo. Please try again.');
        navigate('/dashboard');
        return;
      }
  
      const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
      const token = localStorage.getItem('authToken');
  
      //console.log(integratedBookingInfo);
      const requestDataFirstSchedule = {
        booking: {
          bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          status: 'Booked',
          id: confirmationDataFirstSchedule[0]?.userId,
          bookingType: confirmationDataFirstSchedule[0]?.bookingType,
        },
        flightTickets: confirmationDataFirstSchedule.map((user) => ({
          scheduleId: user.scheduleId,
          name: user.name,
          age: user.age,
          gender: user.gender,
          seatNo: user.selectedSeats[0],
        })),
        connectionFlightTickets: integratedConfirmationDataSecondSchedule.flatMap((user) =>
          user.selectedSeats.map((seat) => ({
            bookingId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: user.name,
            age: user.age,
            gender: user.gender,
            seatNo: seat,
            airlineName: integratedBookingInfo.airlineNames[1],
            sourceAirportId: integratedBookingInfo.sourceIds[1],
            destinationAirportId: integratedBookingInfo.destinationIds[1],
            dateTime: integratedBookingInfo.dateTimes[1],
            flightName: integratedBookingInfo.flightNames[1],
          }))
        ),
      };
  
      //console.log(requestDataFirstSchedule);
  
      let createBookingResponseFirstSchedule;
  
      // Use Axios to make the POST request for the first schedule
      try {
        createBookingResponseFirstSchedule = await axios.post(
          'http://192.168.10.70:98/api/ConnectingBooking/CreateBooking',
          requestDataFirstSchedule,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
            },
          }
        );
  
        //console.log('Response from Axios:', createBookingResponseFirstSchedule);
      } catch (error) {
        console.error('Error in Axios request:', error);
        throw error; // Rethrow the error to handle it later
      }

      
      if (createBookingResponseFirstSchedule.status === 200) {
        // Store the response data in session storage
        const responseData = createBookingResponseFirstSchedule.data;
        sessionStorage.setItem('bookingResponseData', JSON.stringify(responseData));
  
        // Retrieve the response data from session storage
        const bookingResponseDataString = sessionStorage.getItem('bookingResponseData');
        const bookingResponseData = JSON.parse(bookingResponseDataString);
  
        // Check if the response data is available
        if (!bookingResponseData) {
          console.error('Booking response data not found in session storage');
          return;
        }
  
        // Transform the response data into the desired format
        const transformedData = bookingResponseData.ticket.map((ticket) => ({
            bookingId: ticket.bookingId,
            ticketNo: ticket.ticketNo,
            name: ticket.name, 
            age: ticket.age, 
            gender: ticket.gender, 
            seatNo: ticket.seatNo, 
            flightName : integratedBookingInfo.flightNames[1],
            sourceAirportId : integratedBookingInfo.sourceIds[1],
            destinationAirportId : integratedBookingInfo.destinationIds[1],
            airlineName : integratedBookingInfo.airlineNames[1],
            dateTime:integratedBookingInfo.dateTimes[1],
          }));
  
        //console.log('Transformed Data:', transformedData);
        //console.log(transformedData)
        // Send the transformed data to the API
        try {
          const sendDataResponse = await axios.post(
            `${integratedBookingInfo.apiPaths[1]}Integration/partnerbooking`,
            transformedData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the JWT token in the headers
              },
            }
          );
  
         // console.log('Response from sending data to API:', sendDataResponse);
          
          // Handle the response as needed
        } catch (error) {
          console.error('Error sending data to API:', error);
          throw error; // Rethrow the error to handle it later
        }
      } else {
        // Handle unsuccessful response
        console.error('Failed to create booking for the first schedule');
      }
  
      // Clear session storage for the first schedule after successful booking
      sessionStorage.removeItem('savedDataFirstSchedule');
      sessionStorage.removeItem('savedDataFirstIntegratedSchedule');
  
      // Clear session storage for the second schedule after successful booking
      sessionStorage.removeItem('savedDataSecondIntegratedSchedule');
      sessionStorage.removeItem('bookingResponseData');
      sessionStorage.removeItem('bookingData');
      sessionStorage.removeItem('selectedSeatsData');
      sessionStorage.removeItem('integratedBookingInfo');
      sessionStorage.removeItem('numberOfPassengers');
  
      navigate('/dashboard/Tickets/tickets');
      toast.success('Tickets Booked Successfully for both Flights');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking');
      toast.info('Session Expired Please Login again', error);
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
      <div className="container mt-4 p-3 bg-white" style={{ width: '50vw', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
        <h2>Confirm Your Booking</h2>
        <div className="container mt-1 bg-white" style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}} >
        {/* Display user details for the first schedule in a table */}
        <h3>First Flight Details</h3>
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
        </div>
        {/* Display user details for the second schedule in a table */}
        <div className="container mt-1 bg-white" style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}} >
        <h3>Second Flight Details</h3>
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
        </div>
        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-between">
          <Button variant="danger" onClick={handleBack}>
            Back
          </Button>
          {/* <Button variant="secondary" className="mr-2" onClick={handleSave}>
            Save
          </Button> */}
          <Button variant="primary" className="mr-2" onClick={handleConfirm}>
            Confirm
          </Button>
          
        </div>
      </div>
    </Layout>
  );
};

export default IntegratedConfirmBooking;
