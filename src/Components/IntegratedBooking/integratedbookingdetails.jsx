import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../layout';

const IntegratedBookingDetails = () => {
    const [users, setUsers] = useState([{ name: '', age: '', gender: '' }]);
    const [bookingType, setBookingType] = useState('');
    const navigate = useNavigate();
    const { scheduleId } = useParams();
  
    useEffect(() => {
      const firstScheduleId = getFirstScheduleId();
      //fetchData(firstScheduleId);
    }, [scheduleId]);
  
    const getFirstScheduleId = () => {
      try {
        const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
  
        if (!integratedBookingInfoString) {
          toast.error('Invalid integratedBookingInfo. Please try again.');
          navigate('/dashboard');
          return null;
        }
  
        const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
  
        if (
          integratedBookingInfo &&
          Array.isArray(integratedBookingInfo.scheduleIds) &&
          integratedBookingInfo.scheduleIds.length > 0
        ) {
          return integratedBookingInfo.scheduleIds[0];
        } else {
          toast.error('Invalid scheduleIds. Please try again.');
          navigate('/dashboard');
          return null;
        }
      } catch (error) {
        console.error('Error parsing integratedBookingInfo:', error);
        toast.error('Error parsing integratedBookingInfo. Please try again.');
        navigate('/dashboard');
        return null;
      }
    };
  
    const handleAddUser = () => {
      setUsers((prevUsers) => [...prevUsers, { name: '', age: '', gender: '' }]);
    };
  
    const handleRemoveUser = (index) => {
      setUsers((prevUsers) => prevUsers.filter((user, i) => i !== index));
    };
  
    const handleBack = () => {
      navigate('/dashboard');
    };
  
    const handleNext = () => {
      if (users.some((user) => !user.name || !user.age || !user.gender) || !bookingType) {
        toast.error('Please fill in all details and select the booking type.');
        return;
      }
  
      const userDetails = users.map((user) => ({
        name: user.name,
        age: user.age,
        gender: user.gender,
      }));
  
      const bookingData = {
        users: userDetails,
        bookingType,
      };
  
      const numberOfPassengers = users.length;
  
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      sessionStorage.setItem('numberOfPassengers', numberOfPassengers);
  
      try {
        const integratedBookingInfoString = sessionStorage.getItem('integratedBookingInfo');
        if (!integratedBookingInfoString) {
          toast.error('Invalid integratedBookingInfo. Please try again.');
          return;
        }
  
        const integratedBookingInfo = JSON.parse(integratedBookingInfoString);
  
        if (!integratedBookingInfo || !integratedBookingInfo.scheduleIds || !integratedBookingInfo.scheduleIds.length) {
          toast.error('Invalid scheduleIds. Please try again.');
          return;
        }
  
        const firstScheduleId = integratedBookingInfo.scheduleIds[0];
       console.log(firstScheduleId)
        navigate(`/IntegratedBooking/integratedseatbooking/${firstScheduleId}`);
      } catch (error) {
        console.error('Error parsing integratedBookingInfo:', error);
        toast.error('Error parsing integratedBookingInfo. Please try again.');
      }
    };
  
  
  

  return (
    <Layout>
    <div className="container mt-4" style={{ width: '40vw' }}>
      <h1>Booking Details</h1>
      <form>
        {users.map((user, index) => (
          <div key={index} className="mb-3">
            <h5>Passenger {index + 1}</h5>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor={`name${index}`} className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`name${index}`}
                  value={user.name}
                  onChange={(e) => setUsers((prevUsers) => updateUser(prevUsers, index, 'name', e.target.value))}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor={`age${index}`} className="form-label">
                  Age:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`age${index}`}
                  value={user.age}
                  onChange={(e) => setUsers((prevUsers) => updateUser(prevUsers, index, 'age', e.target.value))}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor={`gender${index}`} className="form-label">
                  Gender:
                </label>
                <select
                  id={`gender${index}`}
                  className="form-control"
                  value={user.gender}
                  onChange={(e) => setUsers((prevUsers) => updateUser(prevUsers, index, 'gender', e.target.value))}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            {index > 0 && (
              <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveUser(index)}>
                Remove User
              </button>
            )}
          </div>
        ))}
        <div className="mb-3">
          <label htmlFor="bookingType" className="form-label">
            Booking Type:
          </label>
          <select
            id="bookingType"
            className="form-control"
            value={bookingType}
            onChange={(e) => setBookingType(e.target.value)}
          >
            <option value="">Select Booking Type</option>
            <option value="ONEWAY">One Way</option>
            <option value="ROUNDTRIP">Round Trip</option>
          </select>
        </div>
        <div className="row">
        <div className="col">
            <button type="button" className="btn btn-info" onClick={handleBack}>
              Back
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={handleAddUser}>
              Add Another User
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-success" onClick={handleNext}>
              Next
            </button>
          </div>
          
        </div>
      </form>
    </div>
    </Layout>
  );
};

const updateUser = (prevUsers, index, field, value) => {
  const updatedUsers = [...prevUsers];
  updatedUsers[index][field] = value;
  return updatedUsers;
};

export default IntegratedBookingDetails;
