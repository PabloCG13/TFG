import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link to redirect to University Log In page

const UniversitySignIn = () => {
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState(""); // State to display messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for matching passwords
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setMessage("Processing..."); // Show loading message

    console.log("User:", user);
    console.log("Name:", name);
    console.log("País:", country);
    console.log("Ciudad:", city);
    console.log("Contraseña:", password);

    const universityAddress = "0xF75588126126DdF76bDc8aBA91a08f31d2567Ca5"; // Fixed address

    try {
      const response = await fetch("http://localhost:4000/addUniversity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: universityAddress,
          username: user,
          password: password
        }),
      });

      const data = await response.json();
      

      if (data.success && data.hash !== "Error") {
        setMessage(`University added successfully to the Blockchain! Hash: ${data.hash}`);
        console.log("University added successfully. Hash:", data.hash);
      

      const universityHash = data.hash;
      if(universityHash !== "Error"){
        const dbResponse = await fetch("http://localhost:5000/api/universities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              uniCode: user,  
              name: name,
              location: `${city}, ${country}`,
              hash: universityHash
          }),
      });

      const dbData = await dbResponse.json();
      console.log(dbData);
      if (dbResponse.ok) {
          setMessage(`University registered successfully! ID: ${dbData.unicode}`);
          console.log("Stored University:", dbData);
      } else {
          setMessage(`Failed to create a new entry in the Database error`);
          console.error("Database error:", dbData.error);
      }
      }

    } else {
      if(data.hash === "Error"){
        setMessage(`Failed to add university: ${data.hash}`);
        console.error("Failed to add university:", data.hash);
      }else{
        setMessage(`Failed to add university: ${data.error}`);
        console.error("Failed to add university:", data.error);
      }

    }
    } catch (error) {
        setMessage("API request failed.");
        console.error("Error:", error);
    }

  };

  return (
    <div style={registerPageStyle}>
      <h2>University Sign In</h2>
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
          <label htmlFor="country" style={labelStyle}>Country:</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="city" style={labelStyle}>City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
        <Link to="/University/UniversityLogIn" style={loginLinkStyle}>Go to Login</Link>
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


export default UniversitySignIn;
