import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const CoordinatorTeacherConfirmMarksBody = ({ teacherId }) => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [newCourse, setNewCourse] = useState({
    degreeid: "",
    courseid: "",
    name: "",
    credits: "",
    period: "",
    teacherid: "",
  });
  const [newEntry, setNewEntry] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { participantAddress } = location.state || {};
  const [oldPasswd, setOldPasswd] = useState("");
  const [newPasswd, setNewPasswd] = useState("");

  // State to toggle grade display mode
  const [viewMode, setViewMode] = useState("Letter");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents =
    selectedYear === "All"
      ? students
      : students.filter((student) => student.academicyear === selectedYear);

  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:5000/api/degrees/${teacherId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch courses. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        const degreeId = data.degreeid;
        const uniCode = data.unicode;
        if (!degreeId) {
          throw new Error("degreeid is missing in API response");
        }

        console.log("Extracted degree ID:", degreeId);

        // Fetch students for this courseId
        return fetch(
          `http://localhost:5000/api/transcripts/erasmus/${uniCode}/${degreeId}`
        );
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch students. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((studentData) => setStudents(studentData))
      .catch((error) => console.error("Error:", error));
    //Call to get the teacher data for the profile:
    fetch(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((response) => response.json())
      .then((data) => setTeacher(data))
      .catch((error) => console.error("Error fetching teacher info:", error));
  }, [teacherId]);

  const years = useMemo(() => {
    return [...new Set(students.map((student) => student.academicyear))];
  }, [students]);

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
    //setStudents({...selectedStudent, mark: event.target.value });
  };

  // Function to confirm the new grade
  const handleConfirm = async () => {
    try {
      const prov = 1;

      const dbResponseAddress = await fetch(
        `http://localhost:5000/api/addresses/participant/${selectedStudent.studentid}`
      );
      if (!dbResponseAddress.ok) {
        throw new Error(
          `Failed to fetch student address. Status: ${dbResponseAddress.status}`
        );
      }

      const dbData = await dbResponseAddress.json();
      console.log("Student address:", dbData);

      const dbResponseTranscript = await fetch(
        `http://localhost:5000/api/transcripts/${selectedStudent.studentid}`
      );
      if (!dbResponseTranscript.ok) {
        throw new Error(
          `Failed to fetch transcript. Status: ${dbResponseTranscript.status}`
        );
      }

      let transcriptHash = await dbResponseTranscript.json();
      console.log("Got this transcript before modification:", transcriptHash);
      const currentTimestamp = new Date().toISOString();

      // Step 1: Find the specific entry that matches selectedStudent
      let updatedTranscript = transcriptHash.map((entry) => {
        if (
          entry.unicode === selectedStudent.unicode &&
          entry.degreeid === selectedStudent.degreeid &&
          entry.courseid === selectedStudent.courseid &&
          entry.studentid === selectedStudent.studentid &&
          entry.academicyear === selectedStudent.academicyear
        ) {
          return {
            ...entry,
            provisional: prov, // Update provisional field
            mark: parseInt(selectedStudent.mark, 10), // Update mark field
            lastaccess: currentTimestamp,
          };
        }
        return entry;
      });

      console.log("Updated transcript:", updatedTranscript);
      console.log("Participant", participantAddress);

      // Step 2: Modify transcript on the blockchain
      const transcriptResponse = await fetch(
        "http://localhost:4000/modifyTranscript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: updatedTranscript,
            addressStudent: dbData.addressid,
            address: participantAddress,
            type: 1,
          }),
        }
      );

      if (!transcriptResponse.ok) {
        throw new Error(
          `Failed to modify transcript. Status: ${transcriptResponse.status}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptHashModified = transcriptData.hash;
      console.log("Transcript modified successfully:", transcriptHashModified);

      // Step 3: Update transcript in the database
      const dbResponse = await fetch(
        `http://localhost:5000/api/transcripts/${selectedStudent.unicode}/${selectedStudent.degreeid}/${selectedStudent.courseid}/${selectedStudent.studentid}/${selectedStudent.academicyear}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provisional: prov,
            mark: selectedStudent.mark,
            lastAccess: currentTimestamp,
          }),
        }
      );

      // Handle the response from the database
      if (dbResponse.ok) {
        const responseJson = await dbResponse.json();
        console.log("New mark updated response:", responseJson);
      } else {
        throw new Error("Failed to update mark");
      }

      //Step 5: Update the student's transcript hash
      const updateResponse = await fetch(
        `http://localhost:5000/api/students/${selectedStudent.studentid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcriptHash: transcriptHashModified }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(
          `Failed to update student ${selectedStudent.studentid}. Status: ${updateResponse.status}`
        );
      }

      const updateData = await updateResponse.json();
      console.log(
        `Student ${selectedStudent.studentid} updated successfully with transcriptHash:`,
        updateData
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.studentid === selectedStudent.studentid) {
            return {
              ...student,
              mark: selectedStudent.mark,
              provisional: prov,
            };
          }
          return student;
        })
      );
    } catch (error) {
      console.error("Error:", error);
      setMessage("There was an error updating the grade.");
    }

    closeModal();
  };

  // Method to confirm the mark already given
  const handleFinalConfirm = async (selStudent) => {
    try {
      const dbResponseAddress = await fetch(
        `http://localhost:5000/api/addresses/participant/${selStudent.studentid}`
      );
      if (!dbResponseAddress.ok) {
        throw new Error(
          `Failed to fetch student address. Status: ${dbResponseAddress.status}`
        );
      }

      const dbData = await dbResponseAddress.json();
      console.log("Student address:", dbData);

      const dbResponseTranscript = await fetch(
        `http://localhost:5000/api/transcripts/${selStudent.studentid}`
      );
      if (!dbResponseTranscript.ok) {
        throw new Error(
          `Failed to fetch transcript. Status: ${dbResponseTranscript.status}`
        );
      }

      let transcriptHash = await dbResponseTranscript.json();
      console.log("Got this transcript before modification:", transcriptHash);
      const currentTimestamp = new Date().toISOString();

      // Step 1: Find the specific entry that matches selectedStudent
      let updatedTranscript = transcriptHash.map((entry) => {
        if (
          entry.unicode === selStudent.unicode &&
          entry.degreeid === selStudent.degreeid &&
          entry.courseid === selStudent.courseid &&
          entry.studentid === selStudent.studentid &&
          entry.academicyear === selStudent.academicyear
        ) {
          return {
            ...entry,
            provisional: 1, // Update provisional field
            lastaccess: currentTimestamp,
          };
        }
        return entry;
      });

      console.log("Updated transcript:", updatedTranscript);
      console.log("Participant", participantAddress);

      // Step 2: Modify transcript on the blockchain
      const transcriptResponse = await fetch(
        "http://localhost:4000/modifyTranscript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: updatedTranscript,
            addressStudent: dbData.addressid,
            address: participantAddress,
            type: 1,
          }),
        }
      );

      if (!transcriptResponse.ok) {
        throw new Error(
          `Failed to modify transcript. Status: ${transcriptResponse.status}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptHashModified = transcriptData.hash;
      console.log("Transcript modified successfully:", transcriptHashModified);

      // Step 3: Update the transcript's hash for the student
      const updateResponse = await fetch(
        `http://localhost:5000/api/students/${selStudent.studentid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcriptHash: transcriptHashModified,
            lastAccess: currentTimestamp,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(
          `Failed to update student ${selStudent.studentid}. Status: ${updateResponse.status}`
        );
      }

      const updateData = await updateResponse.json();
      console.log(
        `Student ${selStudent.studentid} updated successfully with transcriptHash:`,
        updateData
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.studentid === selStudent.studentid) {
            return { ...student, mark: selStudent.mark, provisional: 1 };
          }
          return student;
        })
      );
    } catch (error) {
      console.error("Error:", error);
      setMessage("There was an error updating the grade.");
    }
  };

  // Function to change the password
  const changePasswordCall = async () => {
    try {
      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          user: teacherId,
          passwd: oldPasswd,
          role: 3,
          type: 2,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success && data.result === true) {
        const response = await fetch(
          "http://localhost:4000/changeParticipant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: participantAddress,
              user: teacherId,
              passwd: newPasswd,
            }),
          }
        );
        const participantData = await response.json();
        console.log(participantData);
        const teacherHash = participantData.hash;
        if (teacherHash !== "Error") {
          const dbResponse = await fetch(
            `http://localhost:5000/api/teachers/${teacherId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                hash: teacherHash,
              }),
            }
          );

          const dbData = await dbResponse.json();
          console.log(dbData);
        } else {
          setMessage("Invalid credentials. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  // Function to convert grades between "Letter" and "Numeric"
  const convertMark = (mark) => {
    if (viewMode === "Numeric") {
      if (mark === "A") return "90-100";
      if (mark === "B") return "80-89";
      if (mark === "C") return "70-79";
      if (mark === "D") return "60-69";
      if (mark === "E") return "50-59";
      if (mark === "F") return "0-49";
      return mark;
    } else {
      const numericMark = parseInt(mark, 10);

      if (numericMark >= 90) return "A";
      if (numericMark >= 80) return "B";
      if (numericMark >= 70) return "C";
      if (numericMark >= 60) return "D";
      if (numericMark >= 50) return "E";
      if (numericMark < 50) return "F";
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={profileContainer}>
          <div style={profileImage}></div>
          <h2 style={profileTitle}>PROFILE</h2>
          <h2 style={profileTitle}>ID = {teacher.teacherid}</h2>
          <h2 style={profileTitle}>NAME = {teacher.name}</h2>
          <input
            type="password"
            placeholder="Old password"
            style={inputStyle}
            value={oldPasswd}
            onChange={(e) => setOldPasswd(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            style={inputStyle}
            value={newPasswd}
            onChange={(e) => setNewPasswd(e.target.value)}
          />
          <button onClick={changePasswordCall} style={buttonStyle}>
            Modify password
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Course</h2>

          {/* Wrapper to align dropdown above "Mark" */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>
              View grades as:
            </label>
            <select
              style={{ ...inputStyle, width: "150px" }}
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="Letter">Letter (A/B/C)</option>
              <option value="Numeric">Numeric (0-100)</option>
            </select>
          </div>
          <label htmlFor="yearFilter">Filter by Academic Year: </label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Degree</th>
                <th style={thStyle}>Course</th>
                <th style={thStyle}>Grade</th>
                <th style={thStyle}>Provisional</th>
                <th style={thStyle}>Action</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{student.studentid}</td>
                  <td style={tdStyle}>{student.degreeid}</td>
                  <td style={tdStyle}>{student.courseid}</td>
                  <td style={tdStyle}>{convertMark(student.mark)}</td>
                  <td style={tdStyle}>
                    <span style={lockIconStyle}>
                      {student.provisional === 0 ? "🔓" : "🔒"}
                    </span>
                  </td>
                  {student.mark === null && student.provisional !== 1 ? (
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      Waiting for Mark
                    </span>
                  ) : student.mark !== null && student.provisional !== 1 ? (
                    <>
                      <td>
                        <button
                          style={buttonStyle}
                          onClick={() => openModal(student)}
                        >
                          Modify
                        </button>

                        <button
                          style={buttonStyle}
                          onClick={() => handleFinalConfirm(student)}
                        >
                          Confirm
                        </button>
                      </td>
                    </>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        display: "inline-block",
                        padding: "10px 0",
                      }}
                    >
                      Mark Confirmed
                    </span>
                  )}
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

            <label style={labelStyle}>Student ID:</label>
            <input
              type="text"
              value={selectedStudent.studentid}
              readOnly
              style={readOnlyInputStyle}
            />

            <label style={labelStyle}>Grade:</label>
            <input
              type="text"
              value={selectedStudent.mark}
              onChange={handleMarkChange}
              style={inputStyle}
            />

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
  width: "300px",
  backgroundColor: "#2c3e50",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
};

const profileContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
};

const profileImage = {
  width: "200px",
  height: "200px",
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
  margin: "10px -10px",
  borderRadius: "5px",
  border: "1px solid #bdc3c7",
  fontSize: "16px",
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
  marginRight: "10px",
};

const mainContentStyle = {
  flex: 1,
  marginLeft: "0px",
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

const thStyle = {
  padding: "10px",
  backgroundColor: "#f4f4f4",
  fontWeight: "bold",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
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
  width: "250px",
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

const lockIconStyle = {
  width: "20px",
  height: "20px",
  verticalAlign: "middle", // Para alinear el ícono con el checkbox
};

export default CoordinatorTeacherConfirmMarksBody;
