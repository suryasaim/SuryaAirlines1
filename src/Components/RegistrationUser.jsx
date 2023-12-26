import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Registrationuser() {
  const [formData, setFormData] = useState({
    Name: '',
    Username: '',
    Email: '',
    Password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://192.168.10.71:98/api/Authorization/RegistrationUser',
        formData
      );
      toast.success('Registered successfully');
      clearFields();
    } catch (error) {
      alert('Registration failed');
      console.error('Registration failed:', error);
    }
  };

  const clearFields = () => {
    setFormData({
      Name: '',
      Username: '',
      Email: '',
      Password: '',
    });
  };

  return (
    <div style={{ height: '50vh', width: '35vw', margin: 'auto' }}>
      <div className="container mt-5">
        <h2 className="text-center">Surya Airlines</h2>
        <h3 className="text-center">User Registration Form</h3>
        <form onSubmit={handleRegistration}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="Name"
              placeholder="Name"
              value={formData.Name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="Username"
              placeholder="Username"
              value={formData.Username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
          <div className="text-center mb-4 mt-3">
            <Link to="/login" className="btn btn-danger mx-2">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registrationuser;
