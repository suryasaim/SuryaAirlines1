import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../layout';

const ConnectSeatBooking = () => {
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
        const bookingInfoString = sessionStorage.getItem('bookingInfo');
        if (!bookingInfoString) {
          toast.error('Invalid bookingInfo. Please try again.');
          navigate('/dashboard');
          return;
        }

        const bookingInfo = JSON.parse(bookingInfoString);

        if (!bookingInfo || !bookingInfo.scheduleIds || bookingInfo.scheduleIds.length !== 2) {
          toast.error('Invalid scheduleIds. Please try again.');
          navigate('/dashboard');
          return;
        }

        const userSeatsString = sessionStorage.getItem('userDetails');
        const userSeats = userSeatsString ? JSON.parse(userSeatsString) : [];
        setNumUsers(userSeats.length || 1);

        const storedNumberOfPassengers = sessionStorage.getItem('numberOfPassengers');
        setNumberOfPassengers(parseInt(storedNumberOfPassengers, 10) || 1);

        const firstResponse = await fetch(`http://localhost:98/api/Seats/BySchedule/${bookingInfo.scheduleIds[0]}`);
        if (!firstResponse.ok) {
          throw new Error('Failed to fetch seats for the first schedule');
        }
        const firstData = await firstResponse.json();

        const secondResponse = await fetch(`http://localhost:98/api/Seats/BySchedule/${bookingInfo.scheduleIds[1]}`);
        if (!secondResponse.ok) {
          throw new Error('Failed to fetch seats for the second schedule');
        }
        const secondData = await secondResponse.json();

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
      const bookingInfoString = sessionStorage.getItem('bookingInfo');
      if (!bookingInfoString) {
        toast.error('Invalid bookingInfo. Please try again.');
        return;
      }

      const bookingInfo = JSON.parse(bookingInfoString);

      if (!bookingInfo || !bookingInfo.scheduleIds || bookingInfo.scheduleIds.length !== 2) {
        toast.error('Invalid scheduleIds. Please try again.');
        return;
      }

      navigate(`/ConnectBooking/connectconfirmbooking/${bookingInfo.scheduleIds[0]}`);
    } catch (error) {
      console.error('Error navigating:', error);
      toast.error('Error navigating. Please try again.');
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

      if (!bookingInfo || !bookingInfo.scheduleIds || bookingInfo.scheduleIds.length !== 2) {
        toast.error('Invalid scheduleIds. Please try again.');
        return;
      }

      navigate(`/ConnectBooking/Connectbookingdetails/${bookingInfo.scheduleIds[0]}`);
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

export default ConnectSeatBooking;
