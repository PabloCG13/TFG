import React, { useState } from 'react';
import perfil from '../../../Logo/perfil.png'; // Import the image from Logo folder
import { Link } from 'react-router-dom'; // Import Link to redirect
import { useLocation } from 'react-router-dom';

const CoordinatorTeacherValidationListHeader = ({teacherId}) => {
    const location = useLocation();
    const { participantAddress } = location.state || {}; // Extract participantAddress
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

  return (
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
        <h1>Confirm Validations</h1>
        </div>

        <Link
        to={`/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherHome/${teacherId}`} // Route where it links to
        state={{ participantAddress }}  // Pass participantAddress
        style={backButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
        onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)} 
        >
        Back
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

/* Logo button */ 
const buttonStyle = {
  textDecoration: 'none',
};

/* Profile logo */ 
const imageStyle = {
  width: '80px',
  height: '80px',
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

/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
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

/* Title */ 
const titleStyle = {
  flex: 1, 
  textAlign: 'center', 
};

export default CoordinatorTeacherValidationListHeader;