import React, { useState } from "react";

const CourseTeacherHomeBody = () => {
  // State to store students data
  const [students, setStudents] = useState([
    { name: "Student 1", code: "123450", degree: "BS Computer Science", mark: "A" },
    { name: "Student 2", code: "123451", degree: "BS Computer Science", mark: "B" },
    { name: "Student 3", code: "123452", degree: "BS Computer Science", mark: "C" },
  ]);

  // State to control modal visibility and selected student
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to open modal and set selected student
  const openModal = (student) => {
    setSelectedStudent({ ...student });
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to update the student's grade
  const handleMarkChange = (event) => {
    setSelectedStudent({ ...selectedStudent, mark: event.target.value });
  };

  // Function to confirm and save the new grade
  const handleConfirm = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.code === selectedStudent.code ? selectedStudent : student
      )
    );
    closeModal();
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

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Course</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Id</th>
                <th>Degree</th>
                <th>Mark</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.code}</td>
                  <td>{student.degree}</td>
                  <td>{student.mark}</td>
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
            <h2>Modify Mark</h2>

            <label style={labelStyle}>Name:</label>
            <input type="text" value={selectedStudent.name} readOnly style={readOnlyInputStyle} />

            <label style={labelStyle}>Code:</label>
            <input type="text" value={selectedStudent.code} readOnly style={readOnlyInputStyle} />

            <label style={labelStyle}>Mark:</label>
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

// Modal Styles
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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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
