import React, { useState, useEffect } from 'react';
import perfil from '../../Logo/perfil.png'; // Import the image from Logo folder
import { Link } from 'react-router-dom'; // Import Link to redirect

const CoordinatorTeacherHomeHeader = ({teacherId}) => {
  // State to control modal visibility
  const [validations, setValidations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!teacherId) return;


    const fetchValidations = () => {
      fetch(`http://localhost:5000/api/degrees/${teacherId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch degree. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (!data.degreeid) {
            throw new Error("degreeid is missing in API response");
          }

          console.log("Extracted degree ID:", data.degreeid);
          return fetch(`http://localhost:5000/api/validations/provisional/answers/${data.unicode}/${data.degreeid}`);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch students. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(validData => {
          setValidations(validData);
          console.log("Updated validations:", validData);
        })
        .catch(error => console.error("Error:", error));
    };


    // Initial fetch
    fetchValidations();


    // Fetch every 30 seconds
    const interval = setInterval(fetchValidations, 30000);


    // Cleanup function
    return () => clearInterval(interval);
  }, [teacherId]);


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
            <h1>Coordinator Teacher Home Page</h1>
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

          {/* Notifications Icon with Validation Counter */}
          <div style={notificationStyle} className="notifications">
            <button 
              style={starButtonStyle} 
              aria-label="Notifications"
              onClick={openModal}
            >
              <span className="star">★</span>
              {validations.length > 0 && (
                <span style={notificationBadgeStyle}>{validations.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Notifications</h2>
            {validations.length > 0 ? (
              <ul>
                {validations.map((validation, index) => (
                  <li key={index}>
                     There is an answer for the validation request for the course **{validation.courseidsrc}**  
                    <button 
                      style={viewDetailsButtonStyle} 
                      /*onClick={() => handleDstCourse(validation)}*/
                    >
                      View More
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new notifications</p>
            )}
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

const notificationBadgeStyle = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  background: 'red',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  fontSize: '12px',
  textAlign: 'center',
  fontWeight: 'bold',
  lineHeight: '18px',
};

const starButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '30px',
  cursor: 'pointer',
  position: 'relative',
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

const viewDetailsButtonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  fontSize: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};


/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default CoordinatorTeacherHomeHeader;
