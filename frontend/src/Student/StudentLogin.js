import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for controlled redirection

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // State for error messages
  const navigate = useNavigate(); // Navigation hook

  //const participantAddress = "0xf8eA26C3800D074a11bf814dB9a0735886C90197"; // Fixed address

  // Function to handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const dbResponse = await fetch(`http://localhost:5000/api/addresses/participant/${studentId}`);
  
      const dbData = await dbResponse.json();
  
      if (!dbResponse.ok || !dbData.addressid) {
        setMessage("No blockchain address found for this user. Please contact support.");
        console.error("Database error:", dbData);
        return; // Stop execution if no address is found
      }
  
      const participantAddress = dbData.addressid; // Extract address from the database response
      console.log("Fetched Address from DB:", participantAddress);

      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          address: participantAddress, 
          user: studentId, 
          passwd: password, 
          role: 1,
          type: 2 // Set to 2 for student
        }),
      });

      const data = await response.json();

      if (data.success && data.result === true) {
        console.log(response);
        // Navigate to Student Home Page on successful login
        navigate(`/Student/StudentPages/StudentHome/${studentId}`, {
          state: { studentId, participantAddress: participantAddress }
        }); 
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div style={loginPageStyle}>
      <h2>Student Log In</h2>

      {message && <p style={errorStyle}>{message}</p>} {/* Show error message */}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="studentId" style={labelStyle}>User:</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Sign In Link */}
        <div style={linkContainerStyle}>
          <Link to="/Student/StudentSignIn" style={linkStyle}>Sign In</Link>
        </div>

        {/* Submit button */}
        <button type="submit" style={submitButtonStyle}>Submit</button>
      </form>
    </div>
  );
};

// Styles
const loginPageStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputGroupStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

const labelStyle = {
  marginBottom: '5px',
  fontSize: '14px',
  textAlign: 'center',
  width: '100%',
};

const inputStyle = {
  padding: '8px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '40%',
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '150px',
  marginTop: '20px',
};

const linkContainerStyle = {
  marginBottom: '10px',
};

const linkStyle = {
  color: '#007bff',
  fontSize: '16px',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  fontWeight: 'bold',
};

export default StudentLogin;
