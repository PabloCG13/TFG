import React, { useState, useEffect } from 'react';

const StudentTranscriptBody= ({studentId}) => {
  
  const [studentCourse, setStudentCourses] = useState([]);

  
  useEffect(() => {
    //Call to get all the courses in which the student is enrolled
    fetch(`http://localhost:5000/api/transcripts/${studentId}`)
      .then((response) => response.json())
      .then((data) => setStudentCourses(data))
      .catch((error) => console.error("Error fetching student's courses:", error));
  }, [studentId]);

  return (
    <div style={containerStyle}>
      {/* Main content */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Courses</h2>
          <table style={tableStyle}>
          <thead>
            <tr>
              <th>Degree ID</th>
              <th>Course ID</th>
              <th>Mark</th>
              <th>Academic Year</th>
            </tr>
          </thead>
          <tbody>
            {studentCourse.map((course) => (
              <tr key={course.courseid}>
                <td>{course.degreeid}</td>
                <td>{course.courseid}</td>
                <td>{course.mark}</td>
                <td>{course.academicyear}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
};

const mainContentStyle = {
  flex: 1,
  marginLeft: "20px",
};

const tableContainer = {
  background: "#fff",
  padding: "20px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const tableTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};


export default StudentTranscriptBody;
