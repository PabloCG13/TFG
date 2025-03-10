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
          role: 3,
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
            <button onClick={changePasswordCall} style={modifyPassword}>Modify password</button > 
          </div>
        </div>
      </div>
      {/* Buttons Section */}
      <div style={buttonsContainer}>
        <Link
          to={`/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList/${teacherId}`}
          state={{ participantAddress }}  // Pass participantAddress" // Route where it links to
          style={buttonStyle} 
          onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)} 
        >
        Validation List
        </Link>
        <Link 
          to={`/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationPage/CoordinatorTeacherConfirmValidation/${teacherId}`} // Route where it links to
          state={{ participantAddress }}  // Pass participantAddress" // Route where it links to
          style={buttonStyle} 
          onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        >
        Confirm Validations
        </Link>
        <Link 
          to={`/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks/${teacherId}`} // Route where it links to
          state={{ participantAddress }}  // Pass participantAddress" // Route where it links to
          style={buttonStyle} 
          onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
        >
        Confirm Marks
        </Link>
      </div>
      
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
};

const buttonsContainer = {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};
   
const buttonStyle = {
  padding: "8px 16px",
  fontSize: "40px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
};

const modifyPassword = {
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
}

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



/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default CoordinatorTeacherHomeBody;