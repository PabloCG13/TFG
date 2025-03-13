import React from 'react';

const StudentValidationListAskForValidationBody = ({ studentId }) => {
  return (
    <div style={containerStyle}>
      {/* Left Section - Courses */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Degree Courses</h2>
        <ul style={listStyle}>
          <li style={listItemStyle}>FP2 - Fundamentals of Programming</li>
          <li style={highlightedItemStyle}>TP2 - Programming Technology II</li>
        </ul>
      </div>

      {/* Right Section - Universities */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>University List</h2>
        <ul style={listStyle}>
          <li style={highlightedItemStyle}>UPM - Universidad Politécnica de Madrid</li>
          <li style={listItemStyle}>UAM - Universidad Autónoma de Madrid</li>
        </ul>
      </div>
    </div>
  );
};

// 🎨 Inline Styles
const containerStyle = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

const sectionStyle = {
  flex: 1,
  background: '#fff',
  padding: '20px',
  margin: '10px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const highlightedItemStyle = {
  ...listItemStyle,
  border: '2px solid red',
};

export default StudentValidationListAskForValidationBody;
