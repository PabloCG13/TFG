import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link to redirect to Coordinator Teacher Log In page

const CoordinatorTeacherSignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
  };

  return (
    <div style={registerPageStyle}>
      <h2>Coordinator Teacher Sign In</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="username" style={labelStyle}>User:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div>
          <Link to="/CoordinatorTeacher/CoordinatorTeacherLogin" style={submitButtonStyle}>Submit</Link>
        </div>
      </form>
    </div>
  );
};

// Styles
const registerPageStyle = {
  maxWidth: '400px',
  margin: '50px auto', // Center the form horizontally and add space from top
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textAlign: 'center', // Center the text inside the form
};
  
/* Form */
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',     
  justifyContent: 'center', 
};
  
const inputGroupStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',  // Stack label and input vertically
  alignItems: 'center', // Align label and input to the left
  width: '100%', // Make it take full width
};
  
/* Label */
const labelStyle = {
  marginBottom: '5px', // Add space between label and input
  fontSize: '14px',
  textAlign: 'center', // Align the label text to the left
  width: '100%', // Ensure label takes full width
};
  
const inputStyle = {
  padding: '8px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '40%', // Make the input field take full width
};
  
/* Submit button*/
const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '150px', 
  marginTop: '20px', // Add space between inputs and button
  textDecoration: "none"
};

export default CoordinatorTeacherSignIn;
