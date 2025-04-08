import React, { useState, useEffect } from 'react';
import perfil from '../../Logo/perfil.png'; // Import the image from Logo folder
import { Link, useLocation} from 'react-router-dom'; // Import Link to redirect


const StudentHomeHeader = ({studentId}) => {
  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marks, setMarks] = useState([]);
  const [validations, setValidations] = useState([]);

  const fetchMarks = () => {
    fetch(`http://localhost:5000/api/transcripts/notification/${studentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch degree. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data:",data);
        if (!data[0].degreeid) {
          throw new Error("degreeid is missing in API response");
        }

        console.log("Extracted degree ID:", data[0].degreeid);
        setMarks(data);
      })
      .catch(error => console.error("Error:", error));
  };


  const fetchValidations = () => {
    fetch(`http://localhost:5000/api/validates/notification/${studentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch validations. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data:",data);
        if (!data) {
          throw new Error("data is missing in API response");
        }

        console.log("Extracted validations:", data);
        setValidations(data);
      })
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    if (!studentId) return;

    // Initial fetch
    fetchValidations();

    // Fetch every 30 seconds
    const interval = setInterval(fetchValidations, 30000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [studentId]);

  useEffect(() => {
    if (!studentId) return;

    // Initial fetch
    fetchMarks();

    // Fetch every 30 seconds
    const interval = setInterval(fetchMarks, 30000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [studentId]);

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
  };

  const handleValidationClick = async (validations) => {
    console.log("data", validations);
  
    try {
      const responses = await Promise.all(
        validations.map(valid =>
          fetch(`http://localhost:5000/api/validates/${valid.unicodesrc}/${valid.degreeidsrc}/${valid.courseidsrc}/${valid.unicodedst}/${valid.degreeiddst}/${valid.courseiddst}/${valid.studentid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provisional: valid.newprovisional }),
          })
          .then(res => res.json()) // optional: parse response as JSON
          .then(data => ({ success: true, data }))
          .catch(error => ({ success: false, error }))
        )
      );
  
      console.log("All responses:", responses);
    } catch (error) {
      console.error("Unexpected error during validations:", error);
    }
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
            <h1>Student Home Page</h1>
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

            <div style={notificationStyle} className="notifications">
            <button 
              style={starButtonStyle} 
              aria-label="Notifications"
              onClick={openModal}
            >
              <span className="star">★</span>
              {(marks.length > 0 || validations.length > 0) && (
                <span style={notificationBadgeStyle}>{marks.length+validations.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isModalOpen && (
  <div style={modalOverlayStyle} onClick={closeModal}>
    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
      <h2>Notifications</h2>


      {(marks.length > 0 || validations.length > 0) ? (
        <ul>
          {marks.map((mark, index) => (
            <li key={`mark-${index}`}>
              {mark.provisional === 0 ? (
                 <>Your grade for <strong>{mark.courseid}</strong> is now provisonal</>
              ):(
                <>Your grade for <strong>{mark.courseid}</strong> is now definitive</>
              )}
              <Link
                to={`/Student/StudentPages/StudentTranscriptPage/StudentTranscript/${studentId}`}
                state={{ participantAddress }}
                style={viewDetailsButtonStyle}
                onClick={() => handleBackCourse()}
                onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              >
                View More
              </Link>
            </li>
          ))}


          {validations.map((val, index) => (
            <li key={`val-${index}`}>
              Your validation petition for <strong>{val.courseidsrc}</strong> has changed to a new state
              <Link
                to={`/Student/StudentPages/StudentValidationListPage/StudentValidationList/${studentId}`}
                state={{ participantAddress }}
                style={viewDetailsButtonStyle}
                onClick={() => handleValidationClick(validations)}
                onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
              >
                View More
              </Link>
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
  position: 'relative',
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


const viewDetailsButtonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  fontSize: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
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

export default StudentHomeHeader;




