// SeatSelection.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`https://localhost:7200/api/Seats/BySchedule/${scheduleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch seats');
        }
        const data = await response.json();
        setAvailableSeats(data);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching seats');
      }
    };

    fetchSeats();
  }, [scheduleId]);

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeat(seatNumber);
  };

  const handleProceed = () => {
    if (!selectedSeat) {
      toast.error('Please select a seat.');
      return;
    }

    // Save data to session
    sessionStorage.setItem('selectedSeat', selectedSeat);

    // Perform booking logic and navigate to the confirmation page
    navigate('/Booking/confirmation');
  };

  return (
    <Container>
      <h2 className="mt-4 mb-4">Seat Selection</h2>
      <Row>
        {availableSeats.map((seat) => (
          <Col key={seat.seatNumber} xs={6} md={4} lg={3}>
            <Button
              variant={selectedSeat === seat.seatNumber ? 'success' : 'outline-secondary'}
              className="mb-3"
              onClick={() => handleSelectSeat(seat.seatNumber)}
            >
              <FontAwesomeIcon icon={faCouch} className="mr-2" />
              {seat.seatNumber}
            </Button>
          </Col>
        ))}
      </Row>
      <Button variant="primary" onClick={handleProceed}>
        Proceed
      </Button>
    </Container>
  );
};

export default SeatSelection;
