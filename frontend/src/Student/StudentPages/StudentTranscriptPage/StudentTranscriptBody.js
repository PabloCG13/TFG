import React from 'react';

const StudentTranscriptBody= ({studentId}) => {
/* //Call to get all the courses in which the student is enrolled
  fetch(`http://localhost:5000/api/transcripts/${studentId}`)
  .then((response) => response.json())
      .then((data) => setStudentCourses(data))
      .catch((error) => console.error("Error fetching student's courses:", error));
  // create a table that dispays the degreeid, courseid, mark, and academic year  
  */

  return (
    <div>
      <p> Student Transcript Body</p>
    </div>
  );
};



export default StudentTranscriptBody;
