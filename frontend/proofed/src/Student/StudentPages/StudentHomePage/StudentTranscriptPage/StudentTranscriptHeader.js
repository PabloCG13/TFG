import React from 'react';
import perfil from '../../../../Logo/perfil.png'; // Import the image from Logo folder

const StudentTranscriptHeader = () => {
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
          <h1>Student Transcript</h1>
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

export default StudentTranscriptHeader;