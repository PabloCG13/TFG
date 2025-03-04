import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to redirect
import { useLocation } from 'react-router-dom';

const CoordinatorTeacherHomeBody= ({teacherId}) => {

  const location =  useLocation();
  const { participantAddress } = location.state || {}; // Extract data
  return (
    <div style={containerStyle}>
      <Link
        to="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList" // Route where it links to
        style={validationListButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
        onMouseOut={(e) => Object.assign(e.target.style, validationListButtonStyle)} 
      >
      Validation List
      </Link>
      <Link 
        to="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationPage/CoordinatorTeacherConfirmValidation" // Route where it links to
        style={confirmValidationsButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, confirmValidationsButtonStyle)}
      >
      Confirm Validations
      </Link>
      <Link 
        to="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks" // Route where it links to
        style={confirmMarksButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, confirmMarksButtonStyle)}
      >
      Confirm Marks
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
  flexWrap: "wrap", // Prevents overflow on small screens
};
   
/* Confirm Validations Button */
const confirmValidationsButtonStyle = {
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

/* Confirm Marks Button */
const confirmMarksButtonStyle = {
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

export default CoordinatorTeacherHomeBody;