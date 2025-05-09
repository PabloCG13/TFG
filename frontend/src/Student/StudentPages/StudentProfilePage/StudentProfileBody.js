import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const StudentProfileBody = ({ studentId }) => {
  // State to store student data
  const [students1, setStudents1] = useState([]);
  const [students2, setStudents2] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { participantAddress } = location.state || {};

  // Fetch student data on component mount
  useEffect(() => {
    fetch(`http://localhost:5000/api/students/${studentId}`)
      .then((response) => response.json())
      .then((data) => setStudents1(data))
      .catch((error) => console.error("Error fetching student's data:", error));
    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then((response) => response.json())
      .then((data) => setStudents2(data))
      .catch((error) => console.error("Error fetching student's data:", error));
  }, [studentId]);

  // Handle form submission for password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          user: studentId,
          passwd: oldPassword,
          role: 1,
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
              user: studentId,
              passwd: newPassword,
            }),
          }
        );
        const participantData = await response.json();
        console.log(participantData);
        const studentHash = participantData.hash;
        if (studentHash !== "Error") {
          const dbResponse = await fetch(
            `http://localhost:5000/api/students/${studentId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                hash: studentHash,
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

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <div style={styles.content}>
          <div>
            <div style={styles.profilePicture}>🧑</div>
            <p style={styles.field}>
              <strong>NAME:</strong> &nbsp; {students1.name}
            </p>
            <p style={styles.field}>
              <strong>DOB:</strong> &nbsp;{" "}
              {new Date(students1.dob).toLocaleDateString()}
            </p>
            <p style={styles.field}>
              <strong>DNI:</strong> &nbsp; {students1.dni}
            </p>
            <p style={styles.field}>
              <strong>HASH (ID + PASSWORD):</strong> &nbsp; {students1.hash}
            </p>
            {students2.map((student, index) => (
              <div key={index}>
                <p style={styles.field}>
                  <strong>UNIVERSITY:</strong> &nbsp; {student.unicode}
                </p>
                <p style={styles.field}>
                  <strong>DEGREE:</strong> &nbsp; {student.degreeid}
                </p>
              </div>
            ))}
          </div>
          <div style={styles.profileSection}>
            <button style={styles.button} onClick={() => setIsModalOpen(true)}>
              Modify Password
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Old password"
              style={styles.input}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button style={styles.button} onClick={handlePasswordChange}>
              Change Password
            </button>
            <button
              style={styles.smallButton}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    paddingBottom: "100px",
  },
  profileBox: {
    border: "3px solid black",
    padding: "20px",
    borderRadius: "5px",
    width: "900px",
    backgroundColor: "#fff",
    fontFamily: "monospace",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
  },
  field: {
    marginBottom: "30px",
  },
  button: {
    border: "2px solid black",
    padding: "5px",
    background: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  profileSection: {
    textAlign: "center",
  },
  profilePicture: {
    marginBottom: "30px",
    width: "80px",
    height: "80px",
    border: "2px solid black",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
  },
  smallButton: {
    border: "2px solid black",
    padding: "3px",
    background: "none",
    fontSize: "10px",
    marginTop: "5px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  inputStyle: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #bdc3c7",
    fontSize: "16px",
  },
};

export default StudentProfileBody;
