import React, { useState, useEffect } from 'react';
import perfil from '../../Logo/perfil.png'; // Import the image from Logo folder
import { Link } from 'react-router-dom'; // Import Link to redirect

const CourseTeacherHomeHeader = ({teacherId}) => {
const [validations, setValidations] = useState([]);

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/courses/teacher/${teacherId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch courses. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract ONLY the 'courseid' field
            const courseId = data.courseid;  // Assuming the API always returns a single object
            const degreeId = data.degreeid;
            const uniCode = data.unicode;
            if (!courseId) {
                throw new Error("courseid is missing in API response");
            }

            console.log("Extracted course ID:", courseId);

            // Now fetch students for this courseId
            return fetch(`http://localhost:5000/api/validations/request/${uniCode}/${degreeId}/${courseId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch students. Status: ${response.status}`);
            }
            return response.json();
        })
        .then((validData) => setValidations(validData))
        .catch(error => console.error("Error:", error));
      
}, [teacherId]);
  	

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackCourse = () =>{
    const currentTimestamp = new Date().toISOString();
    console.log("Timestamp:", currentTimestamp);
    console.log("teacherId", teacherId);
    // Make the PUT request to update lastAccess
    fetch(`http://localhost:5000/api/teachers/${teacherId}`, {
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
  };

  return (
    <div>
      <header style={headerStyle}>
        <div style={containerStyle}>
          {/* Profile logo */}
          <a href="/" style={buttonStyle}>
            <img
              src={perfil}
              alt="Perfil"
              style={imageStyle}
            />
          </a>

          {/* Title */}
          <div style={titleStyle}>
            <h1>Course Teacher Home Page</h1>
          </div>

          <Link
            to={`/`} // Route where it links to
            style={backButtonStyle} 
            onClick={(e) => {
              e.preventDefault(); // Prevent immediate navigation
              handleBackCourse(); // Call the function
              setTimeout(() => {
                window.location.href = "/"; // Navigate after updating lastAccess
              }, 500); // Delay navigation slightly to ensure update
            }}
            onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
            onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)} 
            >
            Log Out
            </Link>

          {/* Notifications Icon */}
          <div style={notificationStyle} className="notifications">
            <button 
              style={starButtonStyle} 
              aria-label="Notifications"
              onClick={openModal} // Open modal on click.
            >
            <span className="star">★</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Notifications</h2>
            <p>Here is where notifications go...</p>
            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  background: '#282c34',
  color: 'white',
  padding: '10px',
  textAlign: 'center',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1200px',
  margin: '0 auto',
};

const buttonStyle = {
  textDecoration: 'none',
};

const imageStyle = {
  width: '80px',
  height: '80px',
};

const titleStyle = {
  flex: 1,
  textAlign: 'center',
};

const notificationStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const starButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '30px',
  cursor: 'pointer',
};

/* Back button styles */
const backButtonStyle = {
  textDecoration: 'none', /* Remove underline */
  backgroundColor: '#ff4c4c', /* Red background */
  color: 'white', /* White text */
  padding: '10px 20px', /* Padding */
  borderRadius: '5px', /* Rounded corners */
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s', /* Smooth transition for hover effect */
};

// Modal Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // Ensures that modal is above other elements.
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  width: '600px', // Adjust modal style
};

const closeButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '10px',
  marginTop: '20px',
  cursor: 'pointer',
};

/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default CourseTeacherHomeHeader;
