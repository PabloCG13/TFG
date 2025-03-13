import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentTranscriptBody= ({studentId}) => {
  
  const [studentCourse, setStudentCourses] = useState([]);
  const [message, setMessage] = useState(null); // State for error messages
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
      .then((response) =>{
        if (!response.ok) {
          throw new Error(`Failed to fetch validations. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) =>{ 
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setStudentCourses(data);
      })
      .catch((error) => console.error("Error fetching student's courses:", error));
  }, [studentId]);

  const handleTranscript = async () =>{
    console.log("He pulsado el boton con address", participantAddress);
    try{
      console.log("El transcript es ", studentCourse);
      const response = await fetch("http://localhost:4000/askForTranscript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          addressStudent: participantAddress, 
          file: studentCourse
        }),
      });
  
      const data = await response.json();
      console.log("askForTranscript:",data);
      if (data.success && data.result === true) {
        console.log("hash",data.hash);
        // Show on the
        setMessage("Hash:", data.hash);
      } else {
        console.log("hash",data.hash);
        setMessage("Not the correct transcript. Please try again.");
      }
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
    }
  };


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
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={()=> handleTranscript()}>
            Print Transcript
          </button>
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

/* Button Container */
const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full screen height
  gap: "40px", // Space between buttons
    lexWrap: "wrap", // Prevents overflow on small screens
};
   
/* Transcript Button */
const buttonStyle = {
  padding: "12px 24px",
  fontSize: "30px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white", 
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  textDecoration: "none"
};


export default StudentTranscriptBody;
