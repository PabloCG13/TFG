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
  const [showDegreeForm, setShowDegreeForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const [newStudent, setNewStudent] = useState({ studentid: "", degreeid:"", name: "", surname: "", dni: "", dob:"", password: "", confirmPassword: "" });
  const [newTeacher, setNewTeacher] = useState({ teacherid: "", name: "", surname: "", role: "" , password: "", confirmPassword: ""});
  const [newDegree, setNewDegree] = useState({ degreeid:"", name:"", teacherid:"" });
  const [newCourse, setNewCourse] = useState({ degreeid:"", courseid:"", name:"", content:"", credits:"", period:"", teacherid:""});
  
  const [message, setMessage] = useState(''); 
  const location =  useLocation();
  const { universityAddress } = location.state || {}; // Extract data

  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [selectedDegreeId, setSelectedDegreeId] = useState(""); 
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStudentAddress, setSelectedStudentAddress] = useState("");

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
    console.log("Course:", courses);
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
    let namedb;
    let newItem;

    if (type === "students") {
      const student = newStudent;
      if (!student.studentid || !student.degreeid || !student.name || !student.surname|| !student.dni || !student.dob || student.password !== student.confirmPassword) {
        alert("Please enter a valid ID and make sure passwords match");
        return;
      }

      user = student.studentid;
      password = student.password;
      role = 1;
      namedb = `${student.name}, ${student.surname}`;

      body = JSON.stringify({ studentId: user, name: namedb, dob:student.dob, dni:student.dni });
    } 
    else if (type === "teachers") {
      const teacher = newTeacher;
      if (!teacher.teacherid || !teacher.name || !teacher.surname || teacher.password !== teacher.confirmPassword || !teacher.role) {
        alert("Please enter a valid ID, make sure passwords match, and select a role");
        return;
      }

      user = teacher.teacherid;
      console.log("Teacher id:", user);
      password = teacher.password;
      role = teacher.role === "Degree Coordinator" ? 3 : 2; // Determine role based on selection
      namedb = `${teacher.name} ${teacher.surname}`;
      body = JSON.stringify({ teacherId: user, name: namedb});
    } 
    else if(type === "degrees"){//TODO: da un error al añadir un degree
      const degree = newDegree;
      if (!degree.teacherid || !degree.name || !degree.degreeid) {
        alert("Please enter a valid ID, degree coordinator and name");
        return;
      }
      
      const dbResponse = await fetch("http://localhost:5000/api/degrees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            uniCode: uniCode, 
            degreeId: degree.degreeid, 
            name: degree.name,
            teacherId: degree.teacherid
        }),
    });

    const dbData = await dbResponse.json();
    console.log(dbData);
    if (dbResponse.ok) {
        setMessage(`Degree registered successfully! ID: ${dbData.degreeid}`);
        console.log("Stored Degree:", dbData);
    } else {
        setMessage(`Failed to create a new entry in the Database error`);
        console.error("Database error:", dbData.error);
    }
      

    }else if(type==="courses"){
      const course = newCourse;
      if (!course.teacherid || !course.name || !course.degreeid || !course.content || !course.credits || !course.period) {
        alert("Please enter a valid ID, degree coordinator and name");
        return;
      }
      
      const dbResponse = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            uniCode: uniCode, 
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
        setMessage(`Course registered successfully! ID: ${dbData.degreeid}`);
        console.log("Stored Course:", dbData);
      } else {
        setMessage(`Failed to create a new entry in the Database error`);
        console.error("Database error:", dbData.error);
      }
    }
    else {
      if (!newEntry) return;
    }
    
    if(type === "students" || type === "teachers")
    try {
      // Add to the Blockchain first
      //const participantAddress = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"; // Change this as needed
      
      const addressResponse = await fetch(`http://localhost:5000/api/addresses/any-participant/null-participant`); 
        
      const addressData = await addressResponse.json();
      console.log("Addressdata: ", addressData);
      if (!addressResponse.ok || !addressData.addressid) {
        setMessage("Failed to retrieve a free blockchain address.");
        console.error("Address fetch error:", addressData);
        return;
      }
      
      const participantAddress = addressData.addressid; // Retrieved from API
      console.log("Retrieved participant Address:", participantAddress);
      

      setSelectedStudentAddress({ pAddress: participantAddress});
      console.log(selectedStudentAddress);
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

        if(type ==="students"){
          const transcriptResponse = await fetch("http://localhost:4000/modifyTranscript", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file: JSON.parse(body),  // File data from the original request
                addressStudent: participantAddress,
                address: universityAddress,
                type: 2
            }),
        });

        const transcriptData = await transcriptResponse.json();

        if (transcriptResponse.ok) {
          console.log("Transcript modified successfully:", transcriptData);
          const dbResponseTranscript = await fetch(`http://localhost:5000/api/${type}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...JSON.parse(body), hash: data.hash, transcriptHash: transcriptData}), // Añadir hash al body
          });
          newItem = await dbResponseTranscript.json();   

          const dbResponseStudies = await fetch(`http://localhost:5000/api/studies`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId: newStudent.studentid, uniCode: uniCode, degreeId: newStudent.degreeid}), // Añadir hash al body
          }); 
          const test = await dbResponseStudies.json(); 
          console.log(test);

        } else {
            console.error("Failed to modify transcript:", transcriptData.error);
        }
        } else{
          const dbResponse = await fetch(`http://localhost:5000/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...JSON.parse(body), hash: data.hash}), // Añadir hash al body
          });
          newItem = await dbResponse.json();
        }

      } else {
        if (data.hash === "Error") {
          setMessage(`Failed to add user: ${data.hash}`);
          console.error("Failed to add user:", data.hash);
        } else {
          setMessage(`Failed to add user: ${data.error}`);
          console.error("Failed to add user:", data.error);
        }
      }
      
      try {
        console.log("User:", user);
        console.log("address:", participantAddress);
        const updateResponse = await fetch(`http://localhost:5000/api/addresses/${participantAddress}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: user, addressId: participantAddress }),  // Pass the user as body
        });
  
        if (updateResponse.ok) {
          console.log(`Address ${participantAddress} successfully updated with user: ${user}`);
        } else {
          console.error(`Failed to update address: ${participantAddress}`);
        }
      } catch (error) {
        console.error("Failed to update address in the DB:", error);
      }
      
    } catch (error) {
      setMessage("API request failed.");
      console.error("Error:", error);
    }
  
    console.log("NEW ITEM:", newItem);
    // Update state after successful addition to the DB
    switch (type) {
      case "students":
        setStudents([...students, newItem]);
        setShowStudentForm(false);
        setNewStudent({ studentid: "", name:"", surname:"", dni:"", dob:"", password: "", confirmPassword: "" });
        break;
      case "teachers":
        setTeachers([...teachers, newItem]);
        setShowTeacherForm(false);
        setNewTeacher({ teacherid: "", name:"", surname:"", role: "", password: "", confirmPassword: ""});
        break;
      case "courses":
        setCourses([...courses, newCourse]);
        setShowCourseForm(false);
        setNewCourse({ degreeid:"", courseid:"", name:"", content:"", credits:"", period:"", teacherid:""});
        break;
      case "degrees":
        setDegrees([...degrees, newDegree]);
        setShowDegreeForm(false);
        setNewDegree({ degreeid:"", name:"", teacherid:""});
        break; 
      default:
        console.warn(`No state update handler for type: ${type}`);
    }
    
    setNewEntry(""); // Reset input in all cases
  };

  const handleStudentToCourse = async ({ degreeId, courseId, studentId, year, teacherId }) => {

    console.log("degreeID desde la funcion:", degreeId);
    console.log("courseID desde la funcion:", courseId);
    console.log("studentID desde la funcion:", studentId);
    console.log("Year desde la funcion:", year);
    console.log("teacherId desde la funcion:",teacherId);
    try {

      const dbResponse = await fetch("http://localhost:5000/api/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniCode: uniCode,
          degreeId: degreeId,
          courseId: courseId,
          studentId: studentId, // You can include the student ID here if needed in the request body
          academicYear: year,
          provisional: 0, // Assuming provisional is still part of the request
          teacherId: teacherId,
        }),
      });
      
      // Handle the response from the database (optional)
      if (dbResponse.ok) {
        const responseJson = await dbResponse.json();
        console.log('Course assignment response:', responseJson);
      } else {
        throw new Error('Failed to assign course');
      }

      // Step 1: Fetch the teacher's blockchain address from the database
      const dbResponseTranscript = await fetch(`http://localhost:5000/api/transcripts/${studentId}`);

      if (!dbResponseTranscript.ok) {
        throw new Error(`Failed to fetch transcript. Status: ${dbResponseTranscript.status}`);
      }

      const transcriptHash = await dbResponseTranscript.json();
      console.log("Got this transcript: ", transcriptHash);

      const dbResponseTeacher = await fetch(`http://localhost:5000/api/addresses/participant/${teacherId}`);
  
      if (!dbResponseTeacher.ok) {
          throw new Error(`Failed to fetch teacher address. Status: ${dbResponseTeacher.status}`);
      }
  
      const dbData = await dbResponseTeacher.json();
  
      if (!dbData.addressid) {
          setMessage("No blockchain address found for this user. Please contact support.");
          console.error("Database error:", dbData);
          return; // Stop execution
      }
  
      const teacherAddress = dbData.addressid;
      console.log("Fetched Address from DB:", teacherAddress);

      const dbResponseStudent = await fetch(`http://localhost:5000/api/addresses/participant/${studentId}`);

    if (!dbResponseStudent.ok) {
        throw new Error(`Failed to fetch teacher address. Status: ${dbResponseStudent.status}`);
    }

    const dbDataSt = await dbResponseStudent.json();

    if (!dbDataSt.addressid) {
        setMessage("No blockchain address found for this user. Please contact support.");
        console.error("Database error:", dbDataSt);
        return; // Stop execution
    }

    const studentAddress = dbDataSt.addressid;
    console.log("Fetched Address from DB:", studentAddress);
      // Step 2: Modify transcript on the blockchain
      const transcriptResponse = await fetch("http://localhost:4000/modifyTranscript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              file: transcriptHash, //cambiar por el return de la llamada a la db del transcript de un estudiante
              addressStudent: studentAddress,
              address: universityAddress,
              type: 2,
          }),
      });
  
      if (!transcriptResponse.ok) {
          throw new Error(`Failed to modify transcript. Status: ${transcriptResponse.status}`);
      }
  
      const transcriptData = await transcriptResponse.json();
      console.log("Transcript modified successfully:", transcriptData);
  
      //  Step 3: Update student record in the database
      const updateResponse = await fetch(`http://localhost:5000/api/students/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcriptHash: transcriptData }),
      });
  
      if (!updateResponse.ok) {
          throw new Error(`Failed to update student ${studentId}. Status: ${updateResponse.status}`);
      }
  
      const updateData = await updateResponse.json();
      console.log(`Student ${studentId} updated successfully with transcriptHash:`, updateData);
  
      // Step 4: Add teacher to transcript on the blockchain
      const teacherTranscriptResponse = await fetch("http://localhost:4000/addTeacherToTranscript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              addressTeacher: teacherAddress,
              addressUniversity: universityAddress,
              addressStudent: selectedStudentAddress,
          }),
      });
  
      if (!teacherTranscriptResponse.ok) {
          throw new Error(`Failed to add teacher to transcript. Status: ${teacherTranscriptResponse.status}`);
      }
  
      const teacherTranscriptData = await teacherTranscriptResponse.json();
      console.log("Teacher successfully added to transcript:", teacherTranscriptData);
  } catch (error) {
      console.error("Error:", error.message);
      setMessage(error.message); // Display error to the user
  }
  };

  // Function to handle the "Asign Coure" button click
  const handleAssignCourse = (student) => {
    setSelectedStudent({
      studentId: student.studentid,
      studentName: student.name,
    });
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
                <tr><th>NAME</th><th>ID</th><th>DOB</th></tr>
              </thead>
              <tbody>
              {students.map((student) => {
                return (
                  <tr key={student.studentid}>
                  <td>{student.name || "N/A"}</td>
                  <td>{student.studentid}</td>
                  <td>{student.dob}</td>
                   
                  <td>
                  <button onClick={() => handleAssignCourse(student)}> Assign Course </button>
                  </td>
                  
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
             <button onClick={() => setShowCourseForm(true)}>Add Course</button> 
            <table style={tableStyle}>
              <thead>
                <tr><th>NAME</th><th>ID</th><th>DegreeID</th><th>TeacherID</th><th>Content</th><th>Credits</th><th>Period</th></tr>
              </thead>
              <tbody>
              {courses.map((course) => {
                return (
                  <tr key={course.courseid}>
                  <td>{course.name}</td>
                  <td>{course.courseid}</td>
                  <td>{course.degreeid}</td>
                  <td>{course.teacherid}</td>
                  <td>{course.content}</td>
                  <td>{course.credits}</td>
                  <td>{course.period}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "DEGREES" && (
          <>
            <button onClick={() => setShowDegreeForm(true)}>Add Degree</button>
            <table style={tableStyle}>
              <thead>
                <tr><th>NAME</th><th>ID</th><th>TeacherID</th></tr>
              </thead>
              <tbody>
              {degrees.map((degree) => {
                return (
                  <tr key={degree.degreeid}>
                  <td>{degree.name}</td>
                  <td>{degree.degreeid}</td>
                  <td>{degree.teacherid}</td>
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
              <input type="text" placeholder="ID" value={newStudent.studentid} onChange={(e) => setNewStudent({ ...newStudent, studentid: e.target.value })} />
              {/* Dropdown for role selection */}
              <select value={newStudent.degreeid} onChange={(e) => setNewStudent({ ...newStudent, degreeid: e.target.value })} style={inputStyle}>
              <option value="" disabled>Select Degree</option>
              {degrees.map((degree) => (
              <option key={degree.degreeid} value={degree.degreeid}>{degree.name}</option>
              ))}
              </select>
              <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              <input type="text" placeholder="Surname" value={newStudent.surname} onChange={(e) => setNewStudent({ ...newStudent, surname: e.target.value })} />
              <input type="text" placeholder="DNI" value={newStudent.dni} onChange={(e) => setNewStudent({ ...newStudent, dni: e.target.value })} />
              <input type="date" placeholder="DOB" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
              <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" value={newStudent.confirmPassword} onChange={(e) => setNewStudent({ ...newStudent, confirmPassword: e.target.value })} />
              <button onClick={() => handleAddEntry("students")}>Submit</button>
              <button onClick={() => setShowStudentForm(false)}>Cancel</button>
            </div>
          </div>
        )}
          
        {/* Section to select the course for the student */} 
        {selectedStudent && ( 
          <div style={modalStyle}> 
           <div style={formStyle}> 
            <h3 style={formTitleStyle}> Select Course for {selectedStudent.studentName} </h3> 
              {/* Course selection dropdown */} 
              <div style={formGroupStyle}> 
                <label htmlFor="course" style={labelStyle}> Select a Course </label> 
                <select 
                  id="course" 
                  onChange={(e) => { 
                    const selectedCourseId = e.target.value; 
                    const selectedCourse = courses.find(course => course.courseid === selectedCourseId); 
                    
                    if (selectedCourse) { 
                      setSelectedDegreeId(selectedCourse.degreeid); 
                      setSelectedCourseId(selectedCourseId);
                      setSelectedTeacherId(selectedCourse.teacherid); 
                    } 
                  }} 
                  style={inputStyle} 
                  required 
              > 
                <option value="" disabled>Select a course</option> 
                {courses.map((course) => ( 
                  <option key={course.courseid} value={course.courseid}> {course.name} </option> 
                ))} 
              </select> 
            </div> 
            
            {/* Year input field */} 
            <div style={formGroupStyle}> 
              <label htmlFor="year" style={labelStyle}> Year: </label> 
              <input 
                type="number" 
                id="year" value={newStudent.year || ""} 
                onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} 
                style={inputStyle} 
                placeholder="Enter year" 
                required 
              /> 
            </div>    
          
            {/* Submit button */} 
            <div style={submitButtonContainerStyle}> 
              <button onClick={() => { 
                // Extract values from selectedStudentId, selectedDegreeId and selectedTeacherId 
                const degreeId = selectedDegreeId;
                const courseId = selectedCourseId;
                const studentId = selectedStudent.studentId; 
                const { year } = newStudent; 
                const teacherId = selectedTeacherId;
                console.log("degreeID:", degreeId);
                console.log("courseID:", courseId);
                console.log("studentID:", studentId);
                console.log("Year:", year);
                console.log("teacherId:",teacherId);
                try { 
                  handleStudentToCourse({ 
                    degreeId: degreeId,
                    courseId: courseId,
                    studentId: studentId, 
                    year: year, 
                    teacherId: teacherId, 
                }); 
                
                console.log('Course assigned successfully'); 
                // Reset form or close modal after submit (optional) 
                setSelectedStudent(null); 
                // Reset the selected student (optional) 
                setNewStudent({}); 
                } catch (error) { 
                  console.error('Error assigning student to course:', error); 
                } 
              }}  style={buttonStyle}> Submit </button> 
            </div>
            <button onClick ={() => setSelectedStudent(false)}>Cancel</button>
          </div>
        </div> )}

        {showTeacherForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h2>Add Teacher</h2>
              <input type="text" placeholder="ID" value={newTeacher.teacherid} onChange={(e) => setNewTeacher({ ...newTeacher, teacherid: e.target.value })} />
              
              {/* Dropdown for role selection */}
              <select value={newTeacher.role} onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })} style={inputStyle}>
                <option value="">Select Role</option>
                <option value="Course Coordinator">Course Coordinator</option>
                <option value="Degree Coordinator">Degree Coordinator</option>
              </select>

              <input type="text" placeholder="Name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} />
              <input type="text" placeholder="Surname" value={newTeacher.surname} onChange={(e) => setNewTeacher({ ...newTeacher, surname: e.target.value })} />
              <input type="password" placeholder="Password" value={newTeacher.password} onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" value={newTeacher.confirmPassword} onChange={(e) => setNewTeacher({ ...newTeacher, confirmPassword: e.target.value })} />
              <button onClick={() => handleAddEntry("teachers")}>Submit</button>
              <button onClick={() => setShowTeacherForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showCourseForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h4>Add Course</h4>
              <input type="text" placeholder="ID" value={newCourse.courseid} onChange={(e) => setNewCourse({ ...newCourse, courseid: e.target.value })} />
              <select value={newCourse.degreeid} onChange={(e) => setNewCourse({ ...newCourse, degreeid: e.target.value })} style={inputStyle}>
              <option value="" disabled>Select Degree</option>
              {degrees.map((degree) => (
              <option key={degree.degreeid} value={degree.degreeid}> {degree.degreeid}</option>
              ))}
              </select>
              <input type="text" placeholder="Name" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} />
              <input type="text" placeholder="Content description" value={newCourse.content} onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })} />
              <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} />
              <input type="text" placeholder="Period" value={newCourse.period} onChange={(e) => setNewCourse({ ...newCourse, period: e.target.value })} />
              <input type="text" placeholder="Coordinator teacher ID" value={newCourse.teacherid} onChange={(e) => setNewCourse({ ...newCourse, teacherid: e.target.value })} />
              <button onClick={() => handleAddEntry("courses")}>Submit</button>
              <button onClick={() => setShowCourseForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showDegreeForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h5>Add Degree</h5>
                <input type="text" placeholder="ID" value={newDegree.degreeid} onChange={(e) => setNewDegree({ ...newDegree, degreeid: e.target.value })} />
                <input type="text" placeholder="Name" value={newDegree.name} onChange={(e) => setNewDegree({ ...newDegree, name: e.target.value })} />
                <input type="text" placeholder="Coordinator teacher ID" value={newDegree.teacherid} onChange={(e) => setNewDegree({ ...newDegree, teacherid: e.target.value })} />
                <button onClick={() => handleAddEntry("degrees")}>Submit</button>
                <button onClick={() => setShowDegreeForm(false)}>Cancel</button>
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
const buttonStyle = { backgroundColor: '#4CAF50', color: 'white',  padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s ease'};
const formContainerStyle = { maxWidth: '1000px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'};
const formTitleStyle = {textAlign: 'center', marginBottom: '20px'};
const formGroupStyle = {marginBottom: '15px'};
const labelStyle = {fontWeight: 'bold',marginBottom: '5px',display: 'block'};
const submitButtonContainerStyle = {textAlign: 'center'};

export default UniversityHomeBody;
