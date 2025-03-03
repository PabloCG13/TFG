import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to redirect

const StudentHomeBody= ({studentId}) => {
  return (
    <div style={containerStyle}>
      <Link
        to="/Student/StudentPages/StudentTranscriptPage/StudentTranscript" // Route where it links to
        style={transcriptButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
        onMouseOut={(e) => Object.assign(e.target.style, transcriptButtonStyle)} 
      >
      Transcript
      </Link>
      <Link 
        to="/Student/StudentPages/StudentValidationListPage/StudentValidationList" // Route where it links to
        style={validationListButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, validationListButtonStyle)}
      >
      Validation List
      </Link>
      <Link 
        to="/Student/StudentPages/StudentUniversityInformationPage/StudentUniversityInformation" // Route where it links to
        style={universityInformationButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, universityInformationButtonStyle)}
      >
      University Information
      </Link>
      <Link 
        to="/Student/StudentPages/StudentProfilePage/StudentProfile" // Route where it links to
        style={profileButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, profileButtonStyle)}
      >
      Profile
      </Link>
    </div>
  );
};

// Styles

/* Button Container */
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // Full screen height
  gap: "40px", // Space between buttons
    lexWrap: "wrap", // Prevents overflow on small screens
};
   
/* Transcript Button */
const transcriptButtonStyle = {
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
   
/* Validation List Button */
const validationListButtonStyle = {
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

/* University Information Button */
const universityInformationButtonStyle = {
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
  
/* Profile Button */
const profileButtonStyle = {
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

/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default StudentHomeBody;