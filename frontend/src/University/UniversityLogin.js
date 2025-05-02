import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for controlled redirection

const UniversityLogin = ( { login } ) => {
  const [user, setUser] = useState('');
  const [passwd, setPasswd] = useState('');
  const [message, setMessage] = useState(null); 
  const navigate = useNavigate(); 

  // Function to handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
    const dbResponse = await fetch(`http://localhost:5000/api/addresses/participant/${user}`);

    const dbData = await dbResponse.json();

    if (!dbResponse.ok || !dbData.addressid) {
      setMessage("No blockchain address found for this user. Please contact support.");
      console.error("Database error:", dbData);
      return; // Stop execution if no address is found
    }

    const universityAddress = dbData.addressid; // Extract address from the database response
    console.log("Fetched Address from DB:", universityAddress);
 
      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: universityAddress, user: user, passwd: passwd, role: 4, type: 1 }),
      });

      const data = await response.json();

      if (data.success && data.result === true) {
        console.log(response);
        
        login(user, passwd);
        
        navigate(`/University/UniversityPages/UniversityHome/${user}`, {
          state: {
            universityAddress: universityAddress
          }
        }); // Redirect on success
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
      <h2>University Log In</h2>

      {message && <p style={errorStyle}>{message}</p>} {/* Show error message */}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="user" style={labelStyle}>User:</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="passwd" style={labelStyle}>Password:</label>
          <input
            type="password"
            id="passwd"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Sign In Link */}
        <div style={linkContainerStyle}>
          <Link to="/University/UniversitySignIn" style={linkStyle}>Sign In</Link>
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

export default UniversityLogin;
