    import React, { useState, useEffect } from "react";
    import { useLocation } from 'react-router-dom';

    const UniversityHomeBody = ({ uniCode }) => {
      const [activeTab, setActiveTab] = useState("STUDENTS");
      const [students, setStudents] = useState([]);
      const [teachers, setTeachers] = useState([]);
      const [courses, setCourses] = useState([]);
      const [degrees, setDegrees] = useState([]);

      const [showStudentForm, setShowStudentForm] = useState(false);
      const [showTeacherForm, setShowTeacherForm] = useState(false);
      const [newEntry, setNewEntry] = useState("");

      const [newStudent, setNewStudent] = useState({ id: "", password: "", confirmPassword: "" });
      const [newTeacher, setNewTeacher] = useState({ id: "", role: "" , password: "", confirmPassword: ""});

      const [message, setMessage] = useState(''); 
      const location =  useLocation();
      const { universityAddress } = location.state || {}; // Extract data

      useEffect(() => {
        if (!uniCode) return;

        fetch(`http://localhost:5000/api/universities/${uniCode}/students`)
          .then((response) => response.json())
          .then((data) => setStudents(data))
          .catch((error) => console.error("Error fetching students:", error));

        fetch(`http://localhost:5000/api/universities/${uniCode}/teachers`)
          .then((response) => response.json())
          .then((data) => setTeachers(data))
          .catch((error) => console.error("Error fetching teachers:", error));

        fetch(`http://localhost:5000/api/universities/${uniCode}/courses`)
          .then((response) => response.json())
          .then((data) => setCourses(data))
          .catch((error) => console.error("Error fetching courses:", error));

        fetch(`http://localhost:5000/api/universities/${uniCode}/degrees`)
          .then((response) => response.json())
          .then((data) => setDegrees(data))
          .catch((error) => console.error("Error fetching degrees:", error));  
      }, [uniCode]);

      const handleAddEntry = async (type) => {
        let body;
        let user;
        let password;
        let role;

        if (type === "students") {
          const student = newStudent;
          if (!student.id || student.password !== student.confirmPassword) {
            alert("Please enter a valid ID and make sure passwords match");
            return;
          }

          user = student.id;
          password = student.password;
          role = 1;

          body = JSON.stringify({ studentid: user});
        } 
        else if (type === "teachers") {
          const teacher = newTeacher;
          if (!teacher.id || teacher.password !== teacher.confirmPassword || !teacher.role) {
            alert("Please enter a valid ID, make sure passwords match, and select a role");
            return;
          }

          user = teacher.id;
          password = teacher.password;
          role = teacher.role === "Degree Coordinator" ? 3 : 2; // Determine role based on selection

          body = JSON.stringify({ teacherid: user});
        } 
        else {
          if (!newEntry) return;
        }

        try {
          // Add to the Blockchain first
          const participantAddress = "0x69901C8c4263A0368c19D3Cd9dC51B09BeC4C4b1"; // Change this as needed
          const response = await fetch("http://localhost:4000/addParticipant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: participantAddress,
              uni: universityAddress,
              user: user,
              passwd: password,
              role: role
            }),
          });

          const data = await response.json();

          if (data.success && data.hash !== "Error") {
            setMessage(`User added successfully to the Blockchain! Hash: ${data.hash}`);
            console.log("User added successfully. Hash:", data.hash);
            // TODO test API conectivity
            // After successfully adding to the Blockchain, add to the backend
            const dbResponse = await fetch(`http://localhost:5000/api/${type}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...JSON.parse(body), hash: data.hash }), // Añadir hash al body
            });

            const newItem = await dbResponse.json();

            // Update state after successful addition to the DB
            switch (type) {
              case "students":
                setStudents([...students, newItem]);
                setShowStudentForm(false);
                setNewStudent({ id: "", password: "", confirmPassword: "" });
                break;
              case "teachers":
                setTeachers([...teachers, newItem]);
                setShowTeacherForm(false);
                setNewTeacher({ id: "", role: "", password: "", confirmPassword: ""});
                break;
              case "courses":
                setCourses([...courses, newItem]);
                break;
              default:
                console.warn(`No state update handler for type: ${type}`);
            }
            setNewEntry(""); // Reset input in all cases
          } else {
            if (data.hash === "Error") {
              setMessage(`Failed to add user: ${data.hash}`);
              console.error("Failed to add user:", data.hash);
            } else {
              setMessage(`Failed to add user: ${data.error}`);
              console.error("Failed to add user:", data.error);
            }
          }
        } catch (error) {
          setMessage("API request failed.");
          console.error("Error:", error);
        }
      };

      return (
        <div style={containerStyle}>
          <main style={mainContentStyle}>
            <nav style={navStyle}>
              {["STUDENTS", "TEACHERS", "COURSES", "DEGREES"].map((tab) => (
                <button
                  key={tab}
                  style={activeTab === tab ? { ...tabStyle, ...activeTabStyle } : tabStyle}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {activeTab === "STUDENTS" && (
              <>
                <button onClick={() => setShowStudentForm(true)}>Add Student</button>
                <table style={tableStyle}>
                  <thead>
                    <tr><th>NAME</th><th>ID</th></tr>
                  </thead>
                  <tbody>
                  {students.map((student) => {
                    return (
                      <tr key={student.studentid}>
                      <td>{student.name || "N/A"}</td>
                      <td>{student.studentid}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "TEACHERS" && (
              <>
                <button onClick={() => setShowTeacherForm(true)}>Add Teacher</button>
                <table style={tableStyle}>
                  <thead>
                    <tr><th>NAME</th><th>ID</th></tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.teacherid}>
                        <td>{teacher.name || "N/A"}</td>
                        <td>{teacher.teacherid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "COURSES" && (
              <>
                {/* <button onClick={() => setShowCoursesForm(true)}>Add Course</button> */}
                <table style={tableStyle}>
                  <thead>
                    <tr><th>NAME</th><th>ID</th></tr>
                  </thead>
                  <tbody>
                  {courses.map((course) => {
                    return (
                      <tr key={course.courseid}>
                      <td>{course.name}</td>
                      <td>{course.courseid}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "DEGREES" && (
              <>
                {/* <button onClick={() => setShowDegreesForm(true)}>Add Degree</button>*/}
                <table style={tableStyle}>
                  <thead>
                    <tr><th>NAME</th><th>ID</th></tr>
                  </thead>
                  <tbody>
                  {degrees.map((degree) => {
                    return (
                      <tr key={degree.degreeid}>
                      <td>{degree.name}</td>
                      <td>{degree.degreeid}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </>
            )}


            {showStudentForm && (
              <div style={modalStyle}>
                <div style={formStyle}>
                  <h2>Add Student</h2>
                  <input type="text" placeholder="ID" value={newStudent.id} onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })} />
                  {/* Dropdown for role selection */}
                  <select value={newStudent.role} onChange={(e) => setNewTeacher({ ...newStudent, role: e.target.value })} style={inputStyle}>
                  <option value="" disabled>Select Degree</option>
                  {degrees.map((degree) => (
                  <option key={degree.degreeid} value={degree.name}></option>
                  ))}
                  </select>
                  <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} />
                  <input type="password" placeholder="Confirm Password" value={newStudent.confirmPassword} onChange={(e) => setNewStudent({ ...newStudent, confirmPassword: e.target.value })} />
                  <button onClick={() => handleAddEntry("students")}>Submit</button>
                  <button onClick={() => setShowStudentForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {showTeacherForm && (
              <div style={modalStyle}>
                <div style={formStyle}>
                  <h2>Add Teacher</h2>
                  <input type="text" placeholder="ID" value={newTeacher.id} onChange={(e) => setNewTeacher({ ...newTeacher, id: e.target.value })} />
                  
                  {/* Dropdown for role selection */}
                  <select value={newTeacher.role} onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })} style={inputStyle}>
                    <option value="">Select Role</option>
                    <option value="Course Coordinator">Course Coordinator</option>
                    <option value="Degree Coordinator">Degree Coordinator</option>
                  </select>

                  <input type="password" placeholder="Password" value={newTeacher.password} onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })} />
                  <input type="password" placeholder="Confirm Password" value={newTeacher.confirmPassword} onChange={(e) => setNewTeacher({ ...newTeacher, confirmPassword: e.target.value })} />
                  <button onClick={() => handleAddEntry("teachers")}>Submit</button>
                  <button onClick={() => setShowTeacherForm(false)}>Cancel</button>
                </div>
              </div>
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
    const activeTabStyle = { color: "yellow", fontWeight: "bold" };
    const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
    const modalStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
    const formStyle = { background: "white", padding: "20px", borderRadius: "5px", display: "flex", flexDirection: "column", gap: "10px" };
    const inputStyle = { padding: "8px", border: "1px solid #333", borderRadius: "4px" };

    export default UniversityHomeBody;
