import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../layout';
//import { airlinesapi, SuryaairlineUrl } from '../../../Constant';

const IntegratedSeatBooking = () => {
  const { scheduleIds } = useParams();
  const [selectedSeatsFirstSchedule, setSelectedSeatsFirstSchedule] = useState([]);
  const [selectedSeatsSecondSchedule, setSelectedSeatsSecondSchedule] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({
    firstFlightSeats: [],
    secondFlightSeats: [],
  });
  const [numUsers, setNumUsers] = useState(1);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
        try {
          const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
  
          if (!integratedBookingInfoString) {
            toast.error('Invalid integratedBookingInfo. Please try again.');
            navigate('/dashboard');
            return;
          }
  
          const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
  
          if (!integratedBookingInfo || !integratedBookingInfo.scheduleIds || integratedBookingInfo.scheduleIds.length !== 2) {
            toast.error('Invalid scheduleIds. Please try again.');
            navigate('/dashboard');
            return;
          }
  
          const userSeatsString = sessionStorage.getItem('userDetails');
          const userSeats = userSeatsString ? JSON.parse(userSeatsString) : [];
          setNumUsers(userSeats.length || 1);
  
          const storedNumberOfPassengers = sessionStorage.getItem('numberOfPassengers');
          setNumberOfPassengers(parseInt(storedNumberOfPassengers, 10) || 1);
  
          // Fetch seats for the first schedule
          const firstResponse = await fetch(`http://192.168.10.71:98/api/Seats/BySchedule/${integratedBookingInfo.scheduleIds[0]}`);
          let firstData;
          console.log(firstResponse)
          // Check if the first API response is okay
          if (firstResponse.ok) {
            firstData = await firstResponse.json();
          } else {
            // If the first API fails, try the integrated API
            const integratedfirstResponse = await fetch(`${integratedBookingInfo.apiPaths[0]}Integration/Seats/${integratedBookingInfo.scheduleIds[0]}`);
  
            // Check if the integrated API response is okay
            if (integratedfirstResponse.ok) {
              firstData = await integratedfirstResponse.json();
            } else {
              throw new Error('Failed to fetch seats for the first schedule');
            }
          }
  
          // Fetch seats for the second schedule
          const secondResponse = await fetch(`http://192.168.10.71:98/api/Seats/BySchedule/${integratedBookingInfo.scheduleIds[1]}`);
          let secondData;
          console.log(secondResponse)
          // Check if the second API response is okay
          if (secondResponse.ok) {
            secondData = await secondResponse.json();
          } else {
            // If the second API fails, try the integrated API
            const integratedsecondResponse = await fetch(`${integratedBookingInfo.apiPaths[1]}Integration/Seats/${integratedBookingInfo.scheduleIds[1]}`);
            console.log(integratedsecondResponse)
            // Check if the integrated API response is okay
            if (integratedsecondResponse.ok) {
              secondData = await integratedsecondResponse.json();
            } else {
              throw new Error('Failed to fetch seats for the second schedule');
            }
          }
  
          // Set the available seats data
          setAvailableSeats({
            firstFlightSeats: firstData,
            secondFlightSeats: secondData,
          });
        } catch (error) {
          console.error(error);
          toast.error('Error fetching seats');
        }
      };
  
      fetchSeats();
    }, [navigate]);

  const handleSeatSelection = (seatNumber, selectedSeats, setSelectedSeats, schedule) => {
    const isSeatSelected = selectedSeats.includes(seatNumber);
    const isScheduleSeat =
      schedule === 1
        ? availableSeats.firstFlightSeats.some((seat) => seat.seatNumber === seatNumber)
        : availableSeats.secondFlightSeats.some((seat) => seat.seatNumber === seatNumber);

    if (isScheduleSeat) {
      if (isSeatSelected) {
        setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((seat) => seat !== seatNumber));
      } else if (selectedSeats.length < numberOfPassengers) {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seatNumber]);
      } else {
        toast.error(`You can select a maximum of ${numberOfPassengers} seats.`);
      }
    } else {
      toast.error('Invalid seat selection.');
    }
  };

  const handleProceed = () => {
    if (selectedSeatsFirstSchedule.length !== numberOfPassengers || selectedSeatsSecondSchedule.length !== numberOfPassengers) {
      toast.error(`Please select ${numberOfPassengers} seat${numberOfPassengers > 1 ? 's' : ''} for each schedule.`);
      return;
    }

    const selectedSeatsData = {
      selectedSeatsFirstSchedule,
      selectedSeatsSecondSchedule,
    };

    sessionStorage.setItem('selectedSeatsData', JSON.stringify(selectedSeatsData));

    try {
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
      if (!integratedBookingInfoString) {
        toast.error('Invalid integratedBookingInfo. Please try again.');
        return;
      }

      const integratedBookingInfo = JSON.parse(integratedBookingInfoString);

      if (!integratedBookingInfo || !integratedBookingInfo.scheduleIds || integratedBookingInfo.scheduleIds.length !== 2) {
        toast.error('Invalid scheduleIds. Please try again.');
        return;
      }

      navigate(`/IntegratedBooking/integratedconfirmbooking/${integratedBookingInfo.scheduleIds[0]}`);
    } catch (error) {
      console.error('Error navigating:', error);
      toast.error('Error navigating. Please try again.');
    }
  };

  const handleBack = () => {
    try {
      const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
      if (!integratedBookingInfoString) {
        toast.error('Invalid integratedBookingInfo. Please try again.');
        return;
      }

      const integratedBookingInfo = JSON.parse(integratedBookingInfoString);

      if (!integratedBookingInfo || !integratedBookingInfo.scheduleIds || integratedBookingInfo.scheduleIds.length !== 2) {
        toast.error('Invalid scheduleIds. Please try again.');
        return;
      }

      navigate(`/IntegratedBooking/Integratedbookingdetails/${integratedBookingInfo.scheduleIds[0]}`);
    } catch (error) {
      console.error('Error navigating back:', error);
      toast.error('Error navigating back. Please try again.');
    }
  };

  const getSeatVariant = (seat, selectedSeats) => {
    return selectedSeats.includes(seat.seatNumber) ? 'primary' : seat.status === 'Booked' ? 'danger' : 'success';
  };

  return (
    <Layout>
      <Container>
        <h2 className="mt-4 mb-4">Connecting Seat Selection</h2>
        <h2 className="mt-4 mb-4">First Flight Seat Selection</h2>
        <Row xs={2} md={3} lg={6} className="mb-4">
          {availableSeats.firstFlightSeats.map((seat) => (
            <Col key={seat.seatNumber}>
              <Button
                variant={getSeatVariant(seat, selectedSeatsFirstSchedule)}
                className="mb-3"
                onClick={() => handleSeatSelection(seat.seatNumber, selectedSeatsFirstSchedule, setSelectedSeatsFirstSchedule, 1)}
                style={{ width: '60px', height: '10vh' }}
              >
                <FontAwesomeIcon icon={faCouch} size="2x" />
                <div>{seat.seatNumber}</div>
              </Button>
            </Col>
          ))}
        </Row>
        <h2 className="mt-4 mb-4">Second Flight Seat Selection</h2>
        <Row xs={2} md={3} lg={6} className="mb-4">
          {availableSeats.secondFlightSeats.map((seat) => (
            <Col key={seat.seatNumber}>
              <Button
                variant={getSeatVariant(seat, selectedSeatsSecondSchedule)}
                className="mb-3"
                onClick={() => handleSeatSelection(seat.seatNumber, selectedSeatsSecondSchedule, setSelectedSeatsSecondSchedule, 2)}
                style={{ width: '60px', height: '10vh' }}
              >
                <FontAwesomeIcon icon={faCouch} size="2x" />
                <div>{seat.seatNumber}</div>
              </Button>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-between mb-2">
          <Button variant="danger" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" onClick={handleProceed}>
            Proceed
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

export default IntegratedSeatBooking;
