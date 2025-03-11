import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentTranscriptBody= ({studentId}) => {
  
  const [studentCourse, setStudentCourses] = useState([]);
  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress
  
  useEffect(() => {
    const currentTimestamp = new Date().toISOString();

    // Make the PUT request to update lastAccess
    fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastAccess: currentTimestamp }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update lastAccess. Status: ${response.status}`);
      }
      return response.json();
     })
     .then(data => console.log("Successfully updated lastAccess:", data))
     .catch(error => console.error("Error updating lastAccess:", error));
   

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
              <th>Provisional</th>
              <th>Academic Year</th>
              <th>Erasmus</th>
            </tr>
          </thead>
          <tbody>
            {studentCourse.map((course) => (
              <tr key={course.courseid}>
                <td>{course.degreeid}</td>
                <td>{course.courseid}</td>
                <td>{course.mark}</td>
                <td>
                  <span style={lockIconStyle}>
                    {course.provisional === 0 ? "🔓" : "🔒"} 
                  </span>
                </td>
                <td>{course.academicyear}</td>
                <td>{course.erasmus}</td>
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

const lockIconStyle = {
  width: '20px',
  height: '20px',
  verticalAlign: 'middle', // Para alinear el ícono con el checkbox
};


export default StudentTranscriptBody;
