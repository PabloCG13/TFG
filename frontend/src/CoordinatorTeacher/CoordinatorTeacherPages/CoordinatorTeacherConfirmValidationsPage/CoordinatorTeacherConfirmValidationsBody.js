import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';


const CoordinatorTeacherConfirmValidationBody = ({ teacherId }) => {
  const [teacher, setTeacher] = useState([]);
  const [oldPasswd, setOldPasswd] = useState('');
  const [newPasswd, setNewPasswd] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { participantAddress } = location.state || {};


  // Validation states
  const [validations, setValidations] = useState([]);
  const [filteredValidations, setFilteredValidations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueUnicodes, setUniqueUnicodes] = useState([]);
  const [universities, setUniversities] = useState({});
  const [degrees, setDegrees] = useState("");
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");


  // Fetch teacher info
  useEffect(() => {
    if (!teacherId) return;
    fetch(`http://localhost:5000/api/teachers/${teacherId}`)
      .then(response => response.json())
      .then(data => setTeacher(data))
      .catch(error => console.error("Error fetching teacher info:", error));
    fetch(`http://localhost:5000/api/degrees/${teacherId}`)
      .then(response => response.json())
      .then(data => setDegrees(data))
      .catch(error => console.error("Error fetching degree info:", error));
  }, [teacherId, refreshKey]);


  // Fetch all validations
  useEffect(() => {
    const uniCode = degrees.unicode;
    const degreeId = degrees.degreeid;
    fetch(`http://localhost:5000/api/validations/provisional/${uniCode}/${degreeId}`)
      .then(response => response.json())
      .then(data => {
        setValidations(data);
        setFilteredValidations(data);
        const uniqueUnicodesSet = new Set(data.map(v => v.unicodedst));
        setUniqueUnicodes([...uniqueUnicodesSet]);
      })
      .catch(error => console.error("Error fetching validations:", error));
  }, [degrees]);


  // Fetch university details
  useEffect(() => {
    uniqueUnicodes.forEach(unicodedst => {
      fetch(`http://localhost:5000/api/universities/${unicodedst}`)
        .then(response => response.json())
        .then(uniData => {
          setUniversities(prev => ({ ...prev, [unicodedst]: uniData }));
        })
        .catch(error => console.error("Error fetching university:", error));
    });
  }, [uniqueUnicodes]);


  // Open modal to set Month and Year before confirming validation
  const openModal = (valid) => {
    setSelectedValidation(valid);
    setSelectedMonth("");
    setSelectedYear("");
    setIsModalOpen(true);
  };


  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
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
          type: 2
        }),
      });
 
 
      const data = await response.json();
      if (data.success && data.result === true) {
        const response = await fetch("http://localhost:4000/changeParticipant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: participantAddress,
            user: teacherId,
            passwd: newPasswd
          }),
        });
        const participantData = await response.json();
        const teacherHash = participantData.hash;
 
 
        if (teacherHash !== "Error") {
          const dbResponse = await fetch(`http://localhost:5000/api/teachers/${teacherId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hash: teacherHash }),
          });
 
 
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


  const handleAskCourseTeacher = (data) =>{
    setSelectedValidation(data);
    console.log("Selected validation", data);
    setSelectedValidation(data);
    console.log("Selected validation", data);
     // Make the PUT request to update lastAccess
     fetch(`http://localhost:5000/api/validations/${data.unicodesrc}/${data.degreeidsrc}/${data.courseidsrc}/${data.unicodedst}/${data.degreeiddst}/${data.courseiddst}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provisional: 2 }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update provisional. Status: ${response.status}`);
      }
      return response.json();
     })
     .then(data => {
      setRefreshKey(prev => prev +1);
      console.log("Successfully updated provisional:", data);
    })
     .catch(error => console.error("Error updating provisional:", error));   
   
  };
 

  // Function to confirm validation after selecting month and year
  const handleConfirmValidation = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select a month and year before confirming.");
      return;
    }


    const data = selectedValidation;


    // Make the PUT request to update validation
    fetch(`http://localhost:5000/api/validations/${data.unicodesrc}/${data.degreeidsrc}/${data.courseidsrc}/${data.unicodedst}/${data.degreeiddst}/${data.courseiddst}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provisional: 1 }),
    })
    .then(response => response.json())
    .then(data => {
      setRefreshKey(prev => prev + 1);
      console.log("Successfully updated provisional:", data);
      closeModal();
    })
    .catch(error => console.error("Error updating provisional:", error));


    // Blockchain call (Example)
    const courseSrc = `${data.unicodesrc}, ${data.degreeidsrc}, ${data.courseidsrc}`;
    const courseDst = `${data.unicodedst}, ${data.degreeiddst}, ${data.courseiddst}`;


    // await fetch("http://localhost:4000/addValidation", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     address: participantAddress,
    //     srcCour: courseSrc,
    //     dstCour: courseDst,
    //     _month: selectedMonth,
    //     _year: selectedYear
    //   }),
    // });


    console.log(`Confirmed validation for Month: ${selectedMonth}, Year: ${selectedYear}`);
  };


  return (
    <div style={containerStyle}>
      {/* Sidebar with teacher profile */}
      <div style={sidebarStyle}>
        <div style={profileContainer}>
          <div style={profileImage}></div>
          <h2 style={profileTitle}>PROFILE</h2>
          <h2 style={profileTitle}>ID = {teacher.teacherid}</h2>
          <h2 style={profileTitle}>NAME = {teacher.name}</h2>
          <input type="password" placeholder="Old password" style={inputStyle} value={oldPasswd} onChange={(e) => setOldPasswd(e.target.value)}/>
          <input type="password" placeholder="New password" style={inputStyle} value={newPasswd} onChange={(e) => setNewPasswd(e.target.value)} />
          <button onClick={changePasswordCall} style={buttonStyle}>Modify password</button >
        </div>
      </div>




      {/* Table with validations */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Validations</h2>


          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Origin Course</th>
                <th style={thStyle}>Destination Course</th>
                <th style={thStyle}>Validity Period</th>
                <th style={thStyle}>Destination University Name</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidations.map(valid => (
                <tr key={valid.unicodedst}>
                  <td style={tdStyle}>{valid.unicodesrc}, {valid.degreeidsrc}, {valid.courseidsrc}</td>
                  <td style={tdStyle}>{valid.unicodedst}, {valid.degreeiddst}, {valid.courseiddst}</td>
                  <td style={tdStyle}>{valid.period}</td>
                  <td style={tdStyle}>{universities[valid.unicodedst]?.name || "Loading..."}</td>
                  <td>
                    {valid.provisional === 2 ? (
                      <span style={{ color: "orange", fontWeight: "bold" }}>Pending Confirmation</span>
                    ) : (
                      <>
                        <td>
                        <button style={buttonStyle} onClick={() => openModal(valid)}>
                          Confirm
                        </button>
                        </td>
                        <td>
                          <button style={buttonStyle} onClick={() => handleAskCourseTeacher(valid)}>
                          Ask Course Teacher
                          </button>
                        </td>

                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal for selecting Month and Year */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Select Month and Year</h2>
            <label>Month:</label>
            <input type="number" min="1" max="12" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            <label>Year:</label>
            <input type="number" min="2000" max="2100" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} />
            <button style={buttonStyle} onClick={handleConfirmValidation}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};



// Styles
const mainContentStyle = {
  flex: 1,
  marginLeft: '20px',
};

const tableContainer = {
  background: '#fff',
  padding: '20px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
};

const tableTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'center',
};

const thStyle = {
  padding: '10px',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
  borderBottom: '2px solid #ccc',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  textAlign: 'center',
};

const filterContainer = {
  display: 'flex',
  gap: '10px',
  marginBottom: '10px',
};

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
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #bdc3c7",
  fontSize: "16px",
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

export default CoordinatorTeacherConfirmValidationBody;