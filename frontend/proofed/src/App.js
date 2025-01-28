import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./HomePage/Home"; // Import Home
import Login from './Login'; // Import Login
import Register from './Register'; // Import Register
function App() {
  return (
    <Router>
      <Routes>
        {/* Principal route: Home */}
        <Route path="/" element={<Home />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Register route */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
