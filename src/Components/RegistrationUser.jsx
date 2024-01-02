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
        'http://192.168.10.70:98/api/Authorization/RegistrationUser',
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

<div className="d-flex justify-content-center align-items-center">   
  <div className="flex justify-center items-center border bg-white p-3 bold  rounded hover:cursor-pointer m-3"style={{  width: '45vw',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
    <div >
      <div className="container mt-2">
        <h2 className="text-center">Surya Airlines</h2>
        <h4 className="text-center">User Registration Form</h4>
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
          <div className="d-flex flex-column align-items-row">
            <button type="submit" className="btn btn-primary btn-block mb-3">
             Register
            </button>
            <div className="d-flex">
              <span className="text-center">Already have an account? </span>
              <Link to="/login" className="btn btn-danger mx-2">
                Login
              </Link>
              <Link to="/dashboard" className="btn btn-warning mr-3"style={{ marginLeft: '20px' }}>
              Continue Without Login
              </Link>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>  
 </div> 
  );
}

export default Registrationuser;
