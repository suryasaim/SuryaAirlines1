import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import Layout from '../layout';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numUsers, setNumUsers] = useState(1); // Default to 1 user
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        // Retrieve JWT token from localStorage
        const token = localStorage.getItem('authToken');

        // Retrieve scheduleId from session storage
        const bookingInfoString = sessionStorage.getItem('bookingInfo');
        if (!bookingInfoString) {
          toast.error('Invalid bookingInfo. Please try again.');
          // Redirect to the find flights page or handle accordingly
          navigate('/dashboard');
          return;
        }

        const bookingInfo = JSON.parse(bookingInfoString);

        if (!bookingInfo || !bookingInfo.scheduleId) {
          toast.error('Invalid scheduleId. Please try again.');
          // Redirect to the find flights page or handle accordingly
          navigate('/dashboard');
          return;
        }

        // Set the number of users based on user details
        const userSeatsString = sessionStorage.getItem('userDetails');
        const userSeats = userSeatsString ? JSON.parse(userSeatsString) : [];
        setNumUsers(userSeats.length || 1);

        // Fetch numberOfPassengers from session storage
        const storedNumberOfPassengers = sessionStorage.getItem('numberOfPassengers');

        // Set the numberOfPassengers in the component state
        setNumberOfPassengers(parseInt(storedNumberOfPassengers, 10) || 1);

        const response = await fetch(`http://192.168.10.70:98/api/Seats/BySchedule/${bookingInfo.scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }

        const data = await response.json();
        setAvailableSeats(data);
      } catch (error) {
        console.error(error);
        toast.info('Session Expired please Login Again');
      }
    };

    fetchSeats();
  }, [navigate]);

  const handleSelectSeat = (seatNumber) => {
    const seat = availableSeats.find((seat) => seat.seatNumber === seatNumber);

    if (seat.status === 'Booked') {
      toast.error('This seat is already booked. Please select another seat.');
    } else if (selectedSeats.includes(seatNumber)) {
      // Deselect the seat if it was already selected
      setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < numberOfPassengers) {
      // Select the seat if the maximum number of seats is not reached
      setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seatNumber]);
    } else {
      toast.error(`You can select a maximum of ${numberOfPassengers} seats.`);
    }
  };

  const handleProceed = () => {
    // Validate selected seats
    if (selectedSeats.length !== numberOfPassengers) {
      toast.error(`Please select ${numberOfPassengers} seat${numberOfPassengers > 1 ? 's' : ''}.`);
      return;
    }

    // Store selected seats in sessionStorage
    const selectedSeatsData = {
      selectedSeats,
    };
    sessionStorage.setItem('selectedSeatsData', JSON.stringify(selectedSeatsData));

    try {
      // Parse the bookingInfo JSON string
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

      // Redirect to confirmation page with the correct scheduleId
      navigate(`/Booking/confirmbooking/${bookingInfo.scheduleId}`);
    } catch (error) {
      console.error('Error parsing bookingInfo:', error);
      toast.error('Error parsing bookingInfo. Please try again.');
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
      navigate(`/Booking/bookingdetails/${bookingInfo.scheduleId}`);
    } catch (error) {
      console.error('Error navigating back:', error);
      toast.error('Error navigating back. Please try again.');
    }
  };
  

  const lockSeats = (seats) => {
    const lockExpirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes
    const lockedSeats = seats.reduce((acc, seat) => {
      acc[seat] = lockExpirationTime;
      return acc;
    }, {});

    sessionStorage.setItem('lockedSeats', JSON.stringify(lockedSeats));
  };

  const getSeatVariant = (seat) => {
    return selectedSeats.includes(seat.seatNumber) ? 'primary' : seat.status === 'Booked' ? 'danger' : 'outline-success';
  };

  return (
    <Layout>
      <Container className="container p-3" style={{ width: '60vw',background: 'rgba(255, 255, 255, 0.8)',borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <h2 className="mt-4 mb-4">Seat Your Seats</h2>
        <div className="container mt-1" style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}} >
        <Row xs={2} md={3} lg={6} className="mb-4">
          {availableSeats.map((seat) => (
            <Col key={seat.seatNumber}>
              <Button
                variant={getSeatVariant(seat)}
                className="mb-3"
                onClick={() => handleSelectSeat(seat.seatNumber)}
                style={{ width: '60px', height: '10vh' }}
              >
                <FontAwesomeIcon icon={faCouch} size="2x" />
                <div>{seat.seatNumber}</div>
              </Button>
            </Col>
          ))}
        </Row >
        </div>
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

export default SeatSelection;
