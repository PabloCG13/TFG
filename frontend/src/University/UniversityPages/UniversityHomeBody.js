import React, { useState, useEffect } from "react";

const UniversityHomeBody = ({ uniCode }) => {
  const [activeTab, setActiveTab] = useState("STUDENTS");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    if (!uniCode)
      return;
    fetch(`http://localhost:5000/api/universities/${ uniCode }/students`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));

    fetch(`http://localhost:5000/api/universities/${ uniCode }/teachers`)
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => console.error("Error fetching teachers:", error));

    fetch(`http://localhost:5000/api/universities/${ uniCode }/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, [uniCode]);

  const handleAddEntry = (type) => { //TODO general structure. Needs to receive json with necessary fields for the db
    if (!newEntry) return;
    
    fetch(`http://localhost:5000/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newEntry })
    })
      .then((response) => response.json())
      .then((newItem) => {
        if (type === "students") setStudents([...students, newItem]);
        if (type === "teachers") setTeachers([...teachers, newItem]);
        if (type === "courses") setCourses([...courses, newItem]);
        setNewEntry("");
      })
      .catch((error) => console.error(`Error adding ${type}:`, error));
  };

  return (
    <div style={containerStyle}>
      <main style={mainContentStyle}>
        <nav style={navStyle}>
          {["STUDENTS", "TEACHERS", "COURSES"].map((tab) => (
            <button
              key={tab}
              style={activeTab === tab ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <input
          type="text"
          placeholder="Enter name"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          style={inputStyle}
        />
        <button onClick={() => handleAddEntry(activeTab.toLowerCase())}>Add {activeTab.slice(0, -1)}</button>

        {activeTab === "STUDENTS" && (
          <table style={tableStyle}>
            <thead>
              <tr><th>NAME</th><th>ID</th></tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentid}>
                  <td>{student.name}</td>
                  <td>{student.studentid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "TEACHERS" && (
          <table style={tableStyle}>
            <thead>
              <tr><th>NAME</th><th>ID</th></tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.teacherid}>
                  <td>{teacher.name}</td>
                  <td>{teacher.teacherid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "COURSES" && (
          <table style={tableStyle}>
            <thead>
              <tr><th>NAME</th><th>ID</th></tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseid}>
                  <td>{course.name}</td>
                  <td>{course.courseid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

// Styles
const containerStyle = { display: "flex", flexDirection: "column" };
const mainContentStyle = { flex: 1, display: "flex", flexDirection: "column" };
const navStyle = { display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#222" };
const tabStyle = { color: "#fff", background: "none", border: "none", padding: "10px", cursor: "pointer" };
const activeTabStyle = { ...tabStyle, color: "yellow" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const inputStyle = { padding: "8px", border: "1px solid #333", borderRadius: "4px" };
export default UniversityHomeBody;
