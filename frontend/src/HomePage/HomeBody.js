import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to redirect

const HomeBody= () => {
  return (
    <div style={containerStyle}>
      <Link
        to="/Student/StudentLogin" // Route where it links to
        style={studentButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
        onMouseOut={(e) => Object.assign(e.target.style, studentButtonStyle)} 
      >
      Student
      </Link>
      <Link 
      to="/CourseTeacher/CourseTeacherLogin" // Route where it links to
        style={courseTeacherButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, courseTeacherButtonStyle)}
      >
      Course Coordinator
      </Link>
      <Link 
      to="/CoordinatorTeacher/CoordinatorTeacherLogin" // Route where it links to
        style={courseCoordinatorButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, courseCoordinatorButtonStyle)}
      >
      Degree Coordinator
      </Link>
      <Link 
      to="/University/UniversityLogin" // Route where it links to
        style={UniversityButtonStyle} 
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
        onMouseOut={(e) => Object.assign(e.target.style, UniversityButtonStyle)}
      >
      University
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
   
  /* Student Button */
  const studentButtonStyle = {
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
   
  /* Course Teacher Button */
  const courseTeacherButtonStyle = {
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

  /* Course Coordinator Button */
  const courseCoordinatorButtonStyle = {
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
  
  /* University Button */
  const UniversityButtonStyle = {
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

export default HomeBody;