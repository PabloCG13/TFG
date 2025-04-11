import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentTranscriptBody= ({studentId}) => {
  
  const [studentCourse, setStudentCourses] = useState([]);
  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  useEffect(() => {
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
        setModalMessage(`Hash of the transcript: ${data.hash}` );
      } else {
        console.log("hash",data.hash);
        setModalMessage("Not the correct transcript. Please try again.");
      }
    } catch (error) {
      console.error("Error making API request:", error);
      setModalMessage("Server error. Please try again later.");
    }

    setIsModalOpen(true);
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
            <React.Fragment key={course.courseid}>
              <tr>
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
              {course.erasmus === 1 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#007bff', fontStyle: 'italic' }}>
                    This course has been validated by {course.degreeidsrc}, {course.courseidsrc}
                  </td>
                </tr>
              )}
            </React.Fragment>
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
      {/* Modal Popup */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Transcript Verification</h2>
            <p>{modalMessage}</p>
            <button style={closeButtonStyle} onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
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

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "400px",
};

const closeButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "10px",
  marginTop: "20px",
  cursor: "pointer",
  width: "100px",
};


export default StudentTranscriptBody;
