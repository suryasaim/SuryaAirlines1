import React from 'react';

function DisplaySlots({ courses, venues, courseSlots, onDeleteCourseSlot }) {
  return (
    <div className="card">
      <h5 className="card-header">Course Slots</h5>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Slot Number</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseSlots.map((slot) => (
              <tr key={slot.slotID}>
                <td>{courses.find((course) => course.courseID === slot.courseId).courseName}</td>
                <td>{slot.slotNumber}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>{venues.find((venue) => venue.venueID === slot.venueId).venueName}</td>
                <td>
                  <button onClick={() => onDeleteCourseSlot(slot.slotID)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplaySlots;
