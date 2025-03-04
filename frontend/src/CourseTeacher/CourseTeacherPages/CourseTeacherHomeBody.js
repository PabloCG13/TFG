import React, { useState, useEffect } from "react";

const CourseTeacherHomeBody = ({teacherId}) => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ degreeid:"", courseid:"", name:"", content:"", credits:"", period:"", teacherid:""});
  const [newEntry, setNewEntry] = useState("");
  const [message, setMessage] = useState(''); 
  useEffect(() => {
    if (!teacherId) return;

    // First fetch: Get course IDs
    fetch(`http://localhost:5000/api/courses/${teacherId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch courses. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                const courseIds = data.map(course => course.courseid);
                setCourses(courseIds); // Store course IDs
                console.log("Extracted course IDs:", courseIds);

                // Second fetch: Get students for each course ID
                courseIds.forEach(courseId => {
                    fetch(`http://localhost:5000/api/transcripts/students-in-course/${courseId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch students for course ${courseId}. Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(studentData => {
                            console.log(`Students in course ${courseId}:`, studentData);
                        })
                        .catch(error => console.error(`Error fetching students for course ${courseId}:`, error));
                });
            } else {
                console.error("Unexpected response format:", data);
            }
        })
        .catch(error => console.error("Error fetching courses:", error));

}, [teacherId]);

  /*
  useEffect(() => {
    if (!teacherId) return;

    const dbResponseTranscript = fetch(`http://localhost:5000/api/courses/students-in-course/${teacherId}`)     
    .then((response) => response.json())
    .then((data) => setCourses(data))
    .catch((error) => console.error("Error fetching courses:", error));
    console.log("Course:", courses.courseid);

    if (!dbResponseTranscript.ok) {
      throw new Error(`Failed to fetch transcript. Status: ${dbResponseTranscript.status}`);
    }

    const course = dbResponseTranscript.json();
    console.log("Got this course: ", course);  
  }, [teacherId]);

  const handleAddEntry = async (type) => {

    if(type==="courses"){
      const course = newCourse;
      if (!course.teacherid || !course.name || !course.degreeid || !course.content || !course.credits || !course.period) {
        alert("Please enter a valid ID, degree coordinator and name");
        return;
      }
      
      const dbResponse = await fetch("http://localhost:5000/api/courses", { // TODO check if needed all fields
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            degreeId: course.degreeid, 
            courseId: course.courseid,
            name: course.name,
            content: course.content,
            credits: course.credits,
            period: course.period,
            teacherId: course.teacherid
        }),
      });

      const dbData = await dbResponse.json();
      console.log(dbData);
      if (dbResponse.ok) {
        setMessage(`Course registered successfully! ID: ${dbData.degreeid}`); // TODO change message
        console.log("Stored Course:", dbData);
      } else {
        setMessage(`Failed to create a new entry in the Database error`);
        console.error("Database error:", dbData.error);
      }
    }
    else {
      if (!newEntry) return;
    }

    console.log("NEW ITEM:", newCourse);
    // Update state after successful addition to the DB
    switch (type) {
      case "courses":
        setCourses([...courses, newCourse]);
        setNewCourse({ degreeid:"", courseid:"", name:"", content:"", credits:"", period:"", teacherid:""});
        break;
      default:
        console.warn(`No state update handler for type: ${type}`);
    }
    setNewEntry(""); // Reset input in all cases
  };
  */
  
  //Call to the courses that the teacher gives
      /*
      const dbResponseTranscript = await fetch(`http://localhost:5000/api/courses/${teacherId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });

      if (!dbResponseTranscript.ok) {
        throw new Error(`Failed to fetch transcript. Status: ${dbResponseTranscript.status}`);
      }

      const course = await dbResponseTranscript.json();
      console.log("Got this course: ", course);
      /*
      const dbResponseTranscript = await fetch(`http://localhost:5000/api/transcripts/${studentId}`, {
         method: "GET",
         headers: { "Content-Type": "application/json" },
     });


     if (!dbResponseTranscript.ok) {
       throw new Error(`Failed atuto fetch transcript. Status: ${dbResponseTranscript.sts}`);
     }


     const transcriptHash = await dbResponseTranscript.json();
     console.log("Got this transcript: ", transcriptHash);
     */
     

  /*
  Call to get the teacher data for the profile:
    fetch(`http://localhost:5000/api/teacher/${teacherId}`)
      .then((response) => response.json())
      .then((data) => setTeacher(data))
      .catch((error) => console.error("Error fetching teacher info:", error));
  */

  // State to store students
  const [students, setStudents] = useState([
    { name: "Student 1", code: "123450", degree: "BS Computer Science", mark: "A" },
    { name: "Student 2", code: "123451", degree: "BS Computer Science", mark: "B" },
    { name: "Student 3", code: "123452", degree: "BS Computer Science", mark: "C" },
  ]);

  // State to toggle grade display mode
  const [viewMode, setViewMode] = useState("Letter");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to open modal
  const openModal = (student) => {
    setSelectedStudent({ ...student });
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to update student grade in modal
  const handleMarkChange = (event) => {
    setSelectedStudent({ ...selectedStudent, mark: event.target.value });
  };

  // Function to confirm the new grade
  const handleConfirm = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.code === selectedStudent.code ? selectedStudent : student
      )
    );
    closeModal();
  };

  // Function to convert grades between "Letter" and "Numeric"
  const convertMark = (mark) => {
    const markMapping = {
      A: 90,
      B: 80,
      C: 70,
      D: 60,
      F: 50,
    };

    if (viewMode === "Numeric") {
      return markMapping[mark] !== undefined ? markMapping[mark] : mark;
    } else {
      return Object.keys(markMapping).find((key) => markMapping[key] === parseInt(mark)) || mark;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={profileContainer}>
          <div style={profileImage}></div>
          <h2 style={profileTitle}>PROFILE</h2>
          <input type="text" placeholder="Name" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <button style={buttonStyle}>Modify</button>
        </div>
      </div>

      {/* Main content */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Course</h2>

          {/* Wrapper to align dropdown above "Mark" */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", alignItems: "center" }}>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>View grades as:</label>
          <select style={{ ...inputStyle, width: "150px" }} value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="Letter">Letter (A/B/C)</option>
          <option value="Numeric">Numeric (0-100)</option>
          </select>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Student</th>
              <th>ID</th>
              <th>Degree</th>
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.code}</td>
                <td>{student.degree}</td>
                <td>{convertMark(student.mark)}</td>
                <td>
                  <button style={buttonStyle} onClick={() => openModal(student)}>
                  Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && selectedStudent && (
      <div style={modalOverlayStyle} onClick={closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
           <h2>Modify Grade</h2>

           <label style={labelStyle}>Name:</label>
           <input type="text" value={selectedStudent.name} readOnly style={readOnlyInputStyle} />

           <label style={labelStyle}>Code:</label>
           <input type="text" value={selectedStudent.code} readOnly style={readOnlyInputStyle} />

           <label style={labelStyle}>Grade:</label>
           <input type="text" value={selectedStudent.mark} onChange={handleMarkChange} style={inputStyle} />

           <button style={confirmButtonStyle} onClick={handleConfirm}>
            Confirm
           </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
};

const sidebarStyle = {
  width: "250px",
  background: "#ddd",
  padding: "20px",
  textAlign: "center",
};

const profileContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
};

const profileImage = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "#888",
  marginBottom: "10px",
};

const profileTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "5px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const readOnlyInputStyle = {
  ...inputStyle,
  backgroundColor: "#e9ecef",
  cursor: "not-allowed",
};

const labelStyle = {
  display: "block",
  textAlign: "left",
  marginTop: "10px",
  fontWeight: "bold",
};

const buttonStyle = {
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const mainContentStyle = {
  flex: 1,
  marginLeft: "20px",
};

const tableContainer = {
  background: "#fff",
  padding: "20px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const tableTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "400px",
};

const confirmButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "10px",
  marginTop: "20px",
  cursor: "pointer",
  width: "100px",
};

export default CourseTeacherHomeBody;
