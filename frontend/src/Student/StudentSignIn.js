import React, { useState } from "react";
import { Link } from "react-router-dom";

const StudentSignIn = () => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for matching passwords
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setMessage("Processing...");

    console.log("User:", user);
    console.log("Name:", name);
    console.log("Surname:", surname);
    console.log("Passport/DNI:", dni);
    console.log("Date of Birth:", dateOfBirth);
    console.log("Password:", password);

    try {
      // Check if student exists in the database
      const checkResponse = await fetch(`http://localhost:5000/api/students/${user}`);
      const studentData = await checkResponse.json();
      const studentAddress = "0x4b930E7b3E491e37EaB48eCC8a667c59e307ef20"; // Fixed address

      if (checkResponse.ok && studentData) {
        console.log("Student found in DB:", studentData);

        // If student exists, call changeParticipant
        const changeResponse = await fetch("http://localhost:4000/changeParticipant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: studentAddress,
            user: user,
            passwd: password
          }),
        });

        const changeData = await changeResponse.json();

        if (changeData.success) {
          setMessage(`Password changed successfully for Student ID: ${user}`);
          console.log("Password changed:", changeData);
        } else {
          setMessage(`Failed to change password: ${changeData.error}`);
          console.error("Failed to change password:", changeData.error);
        }
      } else {
        setMessage("Student not found. Please check the Student ID.");
        console.error("Student not found.");
      }
    } catch (error) {
      setMessage("API request failed.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={registerPageStyle}>
     <h2>Student Sign In</h2>
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
          <label htmlFor="name" style={labelStyle}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="surname" style={labelStyle}>Surname:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="dni" style={labelStyle}>Passport/DNI:</label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="dateOfBirth" style={labelStyle}>Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
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
        <div style={inputGroupStyle}>
          <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
         />
        </div>
       <button type="submit" style={submitButtonStyle}>Submit</button>
      </form>

      {/* Display messages */}
      {message && <p style={messageStyle}>{message}</p>}

     <div>
       <Link to="/Student/StudentLogIn" style={loginLinkStyle}>Go to Login</Link>
     </div>
   </div>
  );
};

// Styles
const registerPageStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputGroupStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
};

const labelStyle = {
  marginBottom: "5px",
  fontSize: "14px",
  textAlign: "center",
  width: "100%",
};

const inputStyle = {
  padding: "8px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "80%",
};

const submitButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "150px",
  marginTop: "20px",
};

const messageStyle = {
  marginTop: "15px",
  fontSize: "14px",
  color: "#333",
};

const loginLinkStyle = {
  display: "inline-block",
  marginTop: "15px",
  textDecoration: "none",
  color: "#007bff",
};

export default StudentSignIn;