import React, { useState, useEffect, useMemo }  from 'react';
import { Link } from 'react-router-dom'; // Import Link to redirect
import { useLocation } from 'react-router-dom';

const CoordinatorTeacherHomeBody= ({teacherId}) => {
  const [oldPasswd, setOldPasswd] = useState('');
  const [newPasswd, setNewPasswd] = useState('');
  const [teacher, setTeacher] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location =  useLocation();
  const { participantAddress } = location.state || {}; // Extract data
  useEffect(() => {
    if (!teacherId) return;
      fetch(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((response) => response.json())
      .then((data) => setTeacher(data))
      .catch((error) => console.error("Error fetching teacher info:", error));
      
  }, [teacherId]);
  const changePasswordCall = async () => {
    try {
      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          user: teacherId,
          passwd: oldPasswd,
          type: 2 
        }),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.success && data.result === true) {
        const response = await fetch("http://localhost:4000/changeParticipant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          user: teacherId,
          passwd: newPasswd
        }),
      });
      const participantData = await response.json();
    console.log(participantData);
      const teacherHash = participantData.hash;
      if(teacherHash !== "Error"){
        const dbResponse = await fetch(`http://localhost:5000/api/teachers/${teacherId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              hash: teacherHash
          }),
      });
  
      const dbData = await dbResponse.json();
      console.log(dbData);
      
      
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
  }
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
    }
  };


  return (
    

    <div style={containerStyle}>
      <div style={containerStyle}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <div style={profileContainer}>
            <div style={profileImage}></div>
            <h2 style={profileTitle}>PROFILE</h2>
            <h2 style={profileTitle}>ID = {teacher.teacherid}</h2>
            <h2 style={profileTitle}>NAME = {teacher.name}</h2>
            <input type="password" placeholder="Old password" style={inputStyle} value={oldPasswd} onChange={(e) => setOldPasswd(e.target.value)}/>
            <input type="password" placeholder="New password" style={inputStyle} value={newPasswd} onChange={(e) => setNewPasswd(e.target.value)} />
            <button onClick={changePasswordCall} style={buttonStyle}>Modify password</button > 
          </div>
        </div>
      </div>
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #bdc3c7",
  fontSize: "16px",
};

const readOnlyInputStyle = {
  ...inputStyle,
  backgroundColor: "#e9ecef",
  cursor: "not-allowed",
};

const sidebarStyle = {
  width: "300px",
  backgroundColor: "#2c3e50",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
};

const profileContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
 };
 

const profileImage = {
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background: "#888",
  marginBottom: "10px",
};

const profileTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "20px",
};
  
const buttonStyle = {
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};


/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default CoordinatorTeacherHomeBody;