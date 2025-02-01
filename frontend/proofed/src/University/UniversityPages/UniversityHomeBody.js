import React, { useState } from "react";

const UniversityHomeBody = () => {
  const [activeTab, setActiveTab] = useState("STUDENTS");

  return (
    <div style={containerStyle}>
      {/* Main Content */}
      <main style={mainContentStyle}>

        {/* Filter Input */}
        <div style={filterStyle}>
          <span>🔍</span>
          <input type="text" placeholder="Filter by degree" style={inputStyle} />
        </div>

        {/* Navigation Tabs */}
        <nav style={navStyle}>
          <button
            style={activeTab === "STUDENTS" ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab("STUDENTS")}
          >
            STUDENTS
          </button>
          <button
            style={activeTab === "TEACHERS" ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab("TEACHERS")}
          >
            TEACHERS
          </button>
          <button
            style={activeTab === "COURSES" ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab("COURSES")}
          >
            COURSES
          </button>
          <button style={tabStyle} onClick={() => alert("INFORMATION Clicked")}>
            INFORMATION
          </button>
        </nav>

        {/* Students Table (only visible when STUDENTS tab is active) */}
        {activeTab === "STUDENTS" && (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>TRANSCRIPT</th>
                  <th>DEGREE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>1023</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                  <td>INF ENG</td>
                  <td>
                    <button style={removeButtonStyle}>REMOVE</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Teachers Table (only visible when TEACHERS tab is active) */}
        {activeTab === "TEACHERS" && (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>SUBJECT COORDINATED</th>
                  <th>DEGREE COORDINATOR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jane Smith</td>
                  <td>2056</td>
                  <td>Mathematics</td>
                  <td>Math Sciences</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                </tr>
                <tr>
                  <td>Michael Johnson</td>
                  <td>3098</td>
                  <td>Physics</td>
                  <td>Science Dept.</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Courses Table (only visible when COURSES tab is active) */}
        {activeTab === "COURSES" && (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>CONTENT</th>
                  <th>CREDITS</th>
                  <th>STUDY PERIOD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Algorithms</td>
                  <td>3010</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                  <td>5</td>
                  <td>1st Semester</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                </tr>
                <tr>
                  <td>Linear Algebra</td>
                  <td>2045</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                  <td>4</td>
                  <td>2nd Semester</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                </tr>
                <tr>
                  <td>Data Structures</td>
                  <td>3056</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                  <td>6</td>
                  <td>1st Semester</td>
                  <td>
                    <button style={buttonStyle}>VIEW</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  flexDirection: "column",
};

const filterStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #333",
  borderRadius: "4px",
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const navStyle = {
  display: "flex",
  justifyContent: "space-around",
  padding: "10px",
  backgroundColor: "#222",
};

const tabStyle = {
  color: "#fff",
  background: "none",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "10px",
  cursor: "pointer",
};

const activeTabStyle = {
  ...tabStyle,
  color: "yellow",  
};

const tableContainerStyle = {
  padding: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const buttonStyle = {
  padding: "5px 10px",
  border: "2px solid black",
  borderRadius: "10px",
  background: "none",
  cursor: "pointer",
};

const removeButtonStyle = {
  ...buttonStyle,
  color: "red",
  fontWeight: "bold",
};

export default UniversityHomeBody;
