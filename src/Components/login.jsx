import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
  });

  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    // Check for session timeout on component mount
    checkSessionTimeout();
  }, []);

  // Set a timeout to check for session timeout every minute
  useEffect(() => {
    const timeoutId = setInterval(() => {
      checkSessionTimeout();
    }, 60000);

    return () => clearInterval(timeoutId);
  }, []);

  const checkSessionTimeout = () => {
    const lastActivityTimestamp = localStorage.getItem('lastActivityTimestamp');

    if (lastActivityTimestamp) {
      const currentTime = new Date().getTime();
      const sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds

      if (currentTime - lastActivityTimestamp > sessionTimeout) {
        // Session has expired, log out the user
        toast.error('Session expired. Please log in again.');
        clearLocalStorage();
        navigate('/'); // Use navigate to redirect
      }
    }
  };

  const updateLastActivityTimestamp = () => {
    localStorage.setItem('lastActivityTimestamp', new Date().getTime());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://192.168.10.70:98/api/Authorization/login',
        formData
      );

      const authToken = response.data.token;
      const loggedInUserId = response.data.userId;
      const userRole = response.data.role[0]; // Assuming the role is the first element in the array
      const email =response.data.email;

      if (!authToken || !loggedInUserId || !userRole) {
        console.error('Login failed: Token, User ID, or Role not found in the response');
        toast.error('Login failed: Token, User ID, or Role not found in the response');
        return;
      }

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', loggedInUserId);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('email', email);

      toast.success('Login successful');
      updateLastActivityTimestamp();

      if (userRole === 'Admin') {
        navigate('/admindashboard'); // Use navigate to redirect
      } else {
        navigate('/dashboard'); // Use navigate to redirect
      }

      clearFields();
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    }
  };

  const clearFields = () => {
    setFormData({
      Username: '',
      Password: '',
    });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lastActivityTimestamp');
    localStorage.removeItem('email');

  };

  return (
  <div className="d-flex justify-content-center align-items-center">    
    <div className="flex justify-center items-center border bg-white p-3 bold  rounded hover:cursor-pointer m-3"style={{  width: '45vw',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <h3>Login Form</h3>
      <form onSubmit={handleLogin}>
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
            type="password"
            className="form-control"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleInputChange}
          />
        </div>
        <div className="d-flex flex-column align-items-center row p-3">
         <button type="submit" className="btn btn-primary mb-3 ">
           Login
         </button>
         <div className="d-flex">
           <Link to="/" className="btn btn-warning m-auto">
              Back to Registration
           </Link> 
           {/* <Link to="/dashboard" className="btn btn-success mr-3"style={{ marginLeft: '100px' }}>
              Continue Without Login
           </Link> */}
         </div>
        </div>

      </form>
    </div>
  </div>  
  );
}

export default Login;