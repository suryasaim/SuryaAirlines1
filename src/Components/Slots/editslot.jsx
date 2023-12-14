import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../adminlayout';

function EditSlot() {
  const { slotId } = useParams(); // Retrieve the slot ID from the URL parameter

  const [editedCourseSlot, setEditedCourseSlot] = useState({
    courseId: 0,
    slotNumber: '',
    startTime: '',
    endTime: '',
    venueId: 0,
  });

  const [courses, setCourses] = useState([]);
  const [venues, setVenues] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchSlotData() {
      try {
        const slotResponse = await axios.get(`https://localhost:7200/api/CourseSlots/${slotId}`);
        const coursesResponse = await axios.get('https://localhost:7200/api/Courses');
        const venuesResponse = await axios.get('https://localhost:7200/api/Venues');

        setEditedCourseSlot(slotResponse.data);
        setCourses(coursesResponse.data);
        setVenues(venuesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchSlotData();
  }, [slotId]);

  const handleEditCourseSlot = async () => {
    try {
      await axios.put(`https://localhost:7200/api/CourseSlots/${slotId}`, editedCourseSlot);
      setSuccessMessage('Slot updated successfully.');
    } catch (error) {
      console.error('Error editing course slot:', error);
      setSuccessMessage('');
    }
  };

  return (
    <AdminLayout>
      <div className="card my-4">
        <h5 className="card-header">Edit Course Slot</h5>
        <div className="card-body">
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <div className="form-group">
            <label htmlFor="courseSelect">Course:</label>
            <select
              id="courseSelect"
              className="form-control"
              value={editedCourseSlot.courseId}
              onChange={(e) => setEditedCourseSlot({ ...editedCourseSlot, courseId: e.target.value })}
            >
              <option value={0}>Select a course</option>
              {courses.map((course) => (
                <option key={course.courseID} value={course.courseID}>
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
              value={editedCourseSlot.slotNumber}
              onChange={(e) => setEditedCourseSlot({ ...editedCourseSlot, slotNumber: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              className="form-control"
              id="startTime"
              value={editedCourseSlot.startTime}
              onChange={(e) => setEditedCourseSlot({ ...editedCourseSlot, startTime: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              className="form-control"
              id="endTime"
              value={editedCourseSlot.endTime}
              onChange={(e) => setEditedCourseSlot({ ...editedCourseSlot, endTime: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="venueSelect">Venue:</label>
            <select
              id="venueSelect"
              className="form-control"
              value={editedCourseSlot.venueId}
              onChange={(e) => setEditedCourseSlot({ ...editedCourseSlot, venueId: e.target.value })}
            >
              <option value={0}>Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.venueID} value={venue.venueID}>
                  {venue.venueName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleEditCourseSlot} className="btn btn-primary">
            Update Course Slot
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <Link to="/admin/slots" className="btn btn-secondary">
          Back to Slots
        </Link>
      </div>
    </AdminLayout>
  );
}

export default EditSlot;
