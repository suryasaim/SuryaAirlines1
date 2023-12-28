import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../adminlayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const UpdateSchedule = () => {
  const { id } = useParams();

  const [schedule, setSchedule] = useState({
    scheduleId: '',
    flightName: '',
    sourceAirportId: '',
    destinationAirportId: '',
    flightDuration: '',
    arrivalDateTime: new Date(),
  });

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`http://192.168.10.71:98/api/Schedule/GetSchedules/${id}`, { headers });
        const fetchedSchedule = response.data[0];

        if (fetchedSchedule && fetchedSchedule.flightName) {
          setSchedule(fetchedSchedule);
        } else {
          console.error('Invalid schedule data:', fetchedSchedule);
          toast.error('Error fetching schedule data');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        toast.error('Error fetching schedule');
      }
    }

    fetchSchedule();
  }, [id]);

  const handleDurationChange = (e) => {
    const { value } = e.target;
    setSchedule({
      ...schedule,
      flightDuration: value,
    });
  };

  const calculateDepartureTime = () => {
    const { arrivalDateTime, flightDuration } = schedule;
    const departureDateTime = moment(arrivalDateTime).add(moment.duration(flightDuration)).toDate();
    return departureDateTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate departure time before updating
      const departureDateTime = calculateDepartureTime();

      // Update the schedule with new duration
      const token = localStorage.getItem('authToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the Content-Type header
      };

      await axios.patch(`http://192.168.10.71:98/api/Schedule/UpdateSchedule/${id}`, {
        ...schedule,
        departureDateTime,
      }, { headers });

      toast.success('Schedule updated successfully');
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Error updating schedule');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1>Edit Schedule</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="flightName" className="form-label">
              Flight Name
            </label>
            <input
              type="text"
              className="form-control"
              id="flightName"
              name="flightName"
              value={schedule.flightName}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sourceAirportId" className="form-label">
              Source Airport ID
            </label>
            <input
              type="text"
              className="form-control"
              id="sourceAirportId"
              name="sourceAirportId"
              value={schedule.sourceAirportId}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="destinationAirportId" className="form-label">
              Destination Airport ID
            </label>
            <input
              type="text"
              className="form-control"
              id="destinationAirportId"
              name="destinationAirportId"
              value={schedule.destinationAirportId}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="arrivalDateTime" className="form-label">
              Arrival Date and Time
            </label>
            <DatePicker
              selected={schedule.arrivalDateTime}
              onChange={(date) => setSchedule({ ...schedule, arrivalDateTime: date })}
              showTimeSelect
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              id="arrivalDateTime"
              name="arrivalDateTime"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="flightDuration" className="form-label">
              Flight Duration
            </label>
            <input
              type="text"
              className="form-control"
              id="flightDuration"
              name="flightDuration"
              value={schedule.flightDuration}
              onChange={handleDurationChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="departureDateTime" className="form-label">
              Departure Date and Time
            </label>
            <input
              type="text"
              className="form-control"
              id="departureDateTime"
              name="departureDateTime"
              value={calculateDepartureTime().toLocaleString()}
              readOnly
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Schedule
          </button>
        </form>

        <Link to="/admin/Schedules/Schedule" className="btn btn-warning mt-3">
          Back to Schedules
        </Link>
      </div>
    </AdminLayout>
  );
};

export default UpdateSchedule;
