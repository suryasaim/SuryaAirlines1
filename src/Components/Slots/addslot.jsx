import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../adminlayout';

function AddSlot() {
  const [newCourseSlot, setNewCourseSlot] = useState({
    courseName: '', // Name
    venueName: '', // Name
    slotNumber: '',
    startTime: '',
    endTime: '',
  });

  const [courses, setCourses] = useState([]);
  const [venues, setVenues] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Create maps to store course and venue name-to-ID mappings
  const courseNameToIdMap = {};
  const venueNameToIdMap = {};

  useEffect(() => {
    async function fetchCoursesAndVenues() {
      try {
        const coursesResponse = await axios.get('https://localhost:7200/api/Courses');
        const venuesResponse = await axios.get('https://localhost:7200/api/Venues');

        // Populate the name-to-ID mappings
        coursesResponse.data.forEach((course) => {
          courseNameToIdMap[course.courseName] = course.courseID;
        });

        venuesResponse.data.forEach((venue) => {
          venueNameToIdMap[venue.venueName] = venue.venueID;
        });

        setCourses(coursesResponse.data);
        setVenues(venuesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchCoursesAndVenues();
  }, []);

  const handleAddCourseSlot = async () => {
    try {
      // Get the course and venue IDs based on the selected names
      const courseId = courseNameToIdMap[newCourseSlot.courseName];
      const venueId = venueNameToIdMap[newCourseSlot.venueName];

      const dataToSend = {
        courseId,
        venueId,
        slotNumber: newCourseSlot.slotNumber,
        startTime: newCourseSlot.startTime,
        endTime: newCourseSlot.endTime,
      };

      const response = await axios.post('https://localhost:7200/api/CourseSlots', dataToSend);
      const addedCourseSlot = response.data;

      setNewCourseSlot({
        courseName: '', // Reset to default values
        venueName: '',
        slotNumber: '',
        startTime: '',
        endTime: '',
      });

      setSuccessMessage('Slot added successfully.');
    } catch (error) {
      console.error('Error adding course slot:', error);
      setSuccessMessage('');
    }
  };

  return (
    <AdminLayout>
      <div className="card my-4">
        <h5 className="card-header">Add New Course Slot</h5>
        <div className="card-body">
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <div className="form-group">
            <label htmlFor="courseSelect">Course:</label>
            <select
              id="courseSelect"
              className="form-control"
              value={newCourseSlot.courseName}
              onChange={(e) =>
                setNewCourseSlot({
                  ...newCourseSlot,
                  courseName: e.target.value,
                })
              }
            >
              <option value={''} key={0}>
                Select a course
              </option>
              {courses.map((course) => (
                <option key={course.courseID} value={course.courseName}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="slotNumber">Slot Number:</label>
            <input
              type="text"
              className="form-control"
              id="slotNumber"
              value={newCourseSlot.slotNumber}
              onChange={(e) => setNewCourseSlot({ ...newCourseSlot, slotNumber: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              className="form-control"
              id="startTime"
              value={newCourseSlot.startTime}
              onChange={(e) => setNewCourseSlot({ ...newCourseSlot, startTime: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              className="form-control"
              id="endTime"
              value={newCourseSlot.endTime}
              onChange={(e) => setNewCourseSlot({ ...newCourseSlot, endTime: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="venueSelect">Venue:</label>
            <select
              id="venueSelect"
              className="form-control"
              value={newCourseSlot.venueName}
              onChange={(e) =>
                setNewCourseSlot({
                  ...newCourseSlot,
                  venueName: e.target.value,
                })
              }
            >
              <option value={''} key={0}>
                Select a venue
              </option>
              {venues.map((venue) => (
                <option key={venue.venueID} value={venue.venueName}>
                  {venue.venueName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddCourseSlot} className="btn btn-primary">
            Add Course Slot
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <Link to="/admin/Slots/slots" className="btn btn-secondary">
          Back to Slots
        </Link>
      </div>
    </AdminLayout>
  );
}

export default AddSlot;
