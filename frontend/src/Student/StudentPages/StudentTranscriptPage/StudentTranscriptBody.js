import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const StudentTranscriptBody = ({ studentId }) => {
  const [studentCourse, setStudentCourses] = useState([]);
  const location = useLocation();
  const { participantAddress } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    //Call to get all the courses in which the student is enrolled
    fetch(`http://localhost:5000/api/transcripts/${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch validations. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setStudentCourses(data);
      })
      .catch((error) =>
        console.error("Error fetching student's courses:", error)
      );
  }, [studentId]);

  // Method to get the hash of the student
  const handleTranscript = async () => {
    console.log("Address button with", participantAddress);
    try {
      console.log("The transcript is", studentCourse);
      const response = await fetch("http://localhost:4000/askForTranscript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressStudent: participantAddress,
          file: studentCourse,
        }),
      });

      const data = await response.json();
      console.log("askForTranscript:", data);
      if (data.success && data.result === true) {
        console.log("hash", data.hash);
        setModalMessage(`Hash of the transcript: ${data.hash}`);
      } else {
        console.log("hash", data.hash);
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
                <th style={thStyle}>Degree ID</th>
                <th style={thStyle}>Course ID</th>
                <th style={thStyle}>Mark</th>
                <th style={thStyle}>Provisional</th>
                <th style={thStyle}>Academic Year</th>
                <th style={thStyle}>Erasmus</th>
              </tr>
            </thead>
            <tbody>
              {studentCourse.map((course) => (
                <React.Fragment key={course.courseid}>
                  <tr>
                    <td style={tdStyle}>{course.degreeid}</td>
                    <td style={tdStyle}>{course.courseid}</td>
                    <td style={tdStyle}>{course.mark}</td>
                    <td style={tdStyle}>
                      <span style={lockIconStyle}>
                        {course.provisional === 0 ? "🔓" : "🔒"}
                      </span>
                    </td>
                    <td style={tdStyle}>{course.academicyear}</td>
                    <td style={tdStyle}>{course.erasmus ? "✅" : "❌"}</td>
                  </tr>
                  {course.erasmus === 1 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          color: "#007bff",
                          fontStyle: "italic",
                        }}
                      >
                        This course has been validated by {course.degreeidsrc},{" "}
                        {course.courseidsrc}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={() => handleTranscript()}>
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
            <button
              style={closeButtonStyle}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
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
  marginLeft: "0px",
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

const thStyle = {
  padding: "10px",
  backgroundColor: "#f4f4f4",
  fontWeight: "bold",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "center",
};

const lockIconStyle = {
  width: "20px",
  height: "20px",
  verticalAlign: "middle", // Para alinear el ícono con el checkbox
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
  textDecoration: "none",
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
  width: "600px",
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
