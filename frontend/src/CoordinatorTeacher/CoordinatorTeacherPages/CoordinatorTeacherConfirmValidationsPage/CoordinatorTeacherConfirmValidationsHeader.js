import React from 'react';
import perfil from '../../../Logo/perfil.png'; // Import the image from Logo folder
import { Link } from 'react-router-dom'; // Import Link to redirect

const CoordinatorTeacherConfirmValidationHeader = ({teacherId}) => {
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
        style={backButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
        onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)} 
        >
        Back
        </Link>
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

/* Title */ 
const titleStyle = {
  flex: 1, 
  textAlign: 'center', 
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

export default CoordinatorTeacherConfirmValidationHeader;