import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const BookingDetails = () => {
  const { scheduleId } = useParams();
  const [users, setUsers] = useState([{ name: '', age: '', gender: '' }]);
  const [bookingType, setBookingType] = useState('');
  const navigate = useNavigate();

  const handleAddUser = () => {
    setUsers((prevUsers) => [...prevUsers, { name: '', age: '', gender: '' }]);
  };

  const handleRemoveUser = (index) => {
    setUsers((prevUsers) => prevUsers.filter((user, i) => i !== index));
  };

  const handleNext = () => {
    // Validate user details and booking type
    if (users.some((user) => !user.name || !user.age || !user.gender) || !bookingType) {
      toast.error('Please fill in all details and select booking type.');
      return;
    }

    // Store the data in sessionStorage
    const bookingData = {
      users,
      bookingType,
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Check if scheduleId is available
    if (!scheduleId) {
      toast.error('Invalid scheduleId. Please try again.');
      return;
    }

    // Redirect to seat selection page with the correct scheduleId
    navigate(`/Booking/seatbooking/${scheduleId}`);
  };

  return (
    <div className="container mt-4">
      <h1>Booking Details</h1>
      <form>
        {users.map((user, index) => (
          <div key={index} className="mb-3">
            <h5>User {index + 1}</h5>
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
  );
};

const updateUser = (prevUsers, index, field, value) => {
  const updatedUsers = [...prevUsers];
  updatedUsers[index][field] = value;
  return updatedUsers;
};

export default BookingDetails;
