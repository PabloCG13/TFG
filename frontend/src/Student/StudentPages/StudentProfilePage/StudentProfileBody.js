import React, { useState, useEffect } from 'react';

const StudentProfileBody = ({ studentId }) => {
  // State to store student data
  const [students1, setStudents1] = useState([]);
  const [students2, setStudents2] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // TODO function to change student's password. All the process is done, just need to complete this function and should work.
  /*
  // Handle form submission for password change
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (oldPassword && newPassword) {
      // Assuming there is an endpoint to update the password
      fetch(`http://localhost:5000/api/students/${studentId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
          } else {
            setError(data.message || 'Error changing password');
          }
        })
        .catch((error) => {
          console.error("Error changing password:", error);
          setError('Error changing password');
        });
    } else {
      setError('Please provide both old and new passwords');
    }
  };
  */

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <div style={styles.content}>
          <div>
            <div style={styles.profilePicture}>🧑</div>
            <p style={styles.field}><strong>NAME:</strong> &nbsp; {students1.name}</p>
            <p style={styles.field}><strong>DOB:</strong> &nbsp; {students1.dob}</p>
            <p style={styles.field}><strong>HASH (NAME + PASSWORD):</strong> &nbsp; {students1.hash}</p>
            <p style={styles.field}><strong>DEGREE:</strong> &nbsp; {students2.degreeid}</p>
          </div>
          <div style={styles.profileSection}>
            <button style={styles.button} onClick={() => setIsModalOpen(true)}>Modify Password</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Change Password</h3>
            <input type="password" placeholder="Old password" style={styles.input} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="New password" style={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button style={styles.button} onClick={handlePasswordChange}>Change Password</button>
            <button style={styles.smallButton} onClick={() => setIsModalOpen(false)}>Close</button>
            
          </div>
        </div>
      )}

      
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  profileBox: {
    border: '3px solid black',
    padding: '20px',
    borderRadius: '5px',
    width: '900px',
    height:'300px',
    backgroundColor: '#fff',
    fontFamily: 'monospace',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  field: {
    marginBottom:'30px',
  },
  button: {
    border: '2px solid black',
    padding: '5px',
    background: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  profileSection: {
    textAlign: 'center',
  },
  profilePicture: {
    marginBottom:'30px',
    width: '80px',
    height: '80px',
    border: '2px solid black',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
  },
  smallButton: {
    border: '2px solid black',
    padding: '3px',
    background: 'none',
    fontSize: '10px',
    marginTop: '5px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
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

      
    
