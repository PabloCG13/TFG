import React from 'react';
import perfil from './perfil.png'; // Import the image from src
import { Link } from 'react-router-dom'; // Import Link to redirect

const HomeHeader = () => {
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
          <h1>ProofEd</h1>
        </div>

        {/* Login button */}
        <div>
          <Link to="/login" style={loginButtonStyle}>Login</Link>
        </div>

        {/* Register button */}
        <div>
          <Link to="/register" style={registerButtonStyle}>Register</Link>
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

/* Title */ 
const titleStyle = {
  flex: 1, 
  textAlign: 'center', 
};

/* Login button */
const loginButtonStyle = {
  backgroundColor: '#4CAF50', // Green
  color: 'white',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  textAlign: 'center',
  display: 'inline-block',
  cursor: 'pointer',
};
/* Register button */
const registerButtonStyle = {
  backgroundColor: '#2196F3', // Blue
  color: 'white',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  textAlign: 'center',
  display: 'inline-block',
  cursor: 'pointer',
  marginLeft: '10px', // Add space between buttons
};
  

export default HomeHeader;
