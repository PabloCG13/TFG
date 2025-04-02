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
      .then(data => {
        console.log("degrees", data);
        setDegrees(data);})
      .catch(error => console.error("Error fetching degree info:", error));
  }, [teacherId, refreshKey]);


  // Fetch all validations
  useEffect(() => {
    if(!degrees) return; 
    const uniCode = degrees.unicode;
    const degreeId = degrees.degreeid;
    console.log("Uni", uniCode , degreeId);
    fetch(`http://localhost:5000/api/validations/provisionals/${uniCode}/${degreeId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Provisional Validations",data);
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
 
  const handleBlockchain = async (teacherDst, unicodesrc, degreeidsrc, courseidsrc, unicodedst, degreeiddst, courseiddst) => {
    // Get the address of the teacher of the DstCourse
    const dbResponse = await fetch(`http://localhost:5000/api/addresses/participant/${teacherDst}`);
    const dbData = await dbResponse.json();
  
  
    if (!dbResponse.ok || !dbData.addressid) {
      setMessage("No blockchain address found for this user. Please contact support.");
      console.error("Database error:", dbData);
      return;
    }
  
  
    const courseDstAddress = dbData.addressid;
    console.log("Fetched Address from DB:", courseDstAddress);
  
  
    // Get srcUni address
    const dbResponseUni = await fetch(`http://localhost:5000/api/addresses/participant/${unicodesrc}`);
    const dbDataUni = await dbResponseUni.json(); // <-- FIXED: was dbResponse
  
  
    if (!dbResponseUni.ok || !dbDataUni.addressid) {
      setMessage("No blockchain address found for this user. Please contact support.");
      console.error("Database error:", dbDataUni); // <-- FIXED: was dbData
      return;
    }
  
  
    const uniAddress = dbDataUni.addressid; // <-- FIXED: was dbData
    console.log("Fetched Address from DB:", uniAddress);
  
  
    // Get validation entries
    const dbStudentsResponse = await fetch(`http://localhost:5000/api/validates/validation/${unicodesrc}/${degreeidsrc}/${courseidsrc}/${unicodedst}/${degreeiddst}/${courseiddst}`);
    const dbDataStudents = await dbStudentsResponse.json();
  
  
    if (!dbStudentsResponse.ok) {
      console.error("Database error:", dbDataStudents); // <-- FIXED: was dbData
      return;
    }
  
  
    const studentAddresses = [];
  
  
    for (const student of dbDataStudents) {
      try {
        const res = await fetch(`http://localhost:5000/api/addresses/participant/${student.studentid}`);
        const data = await res.json();
  
  
        if (res.ok && data.addressid) {
          studentAddresses.push({
            studentid: student.studentid,
            address: data.addressid
          });
  
  
          // Get list of allowed teachers
          const teachersResponse = await fetch("http://localhost:4000/getTeachersAllowed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: data.addressid
            }),
          });
  
  
          if (!teachersResponse.ok) {
            console.error(`Failed to fetch teachers for student ${student.studentid}. Status: ${teachersResponse.status}`);
            continue;
          }
  
          const teachersData = await teachersResponse.json();
  
          if (!Array.isArray(teachersData.teachers)) {
            console.error(`Malformed teachers data for student ${student.studentid}`, teachersData);
            continue;
          }
          //Check if DegreeCoord is already allowed to modify the transcript of this student
          const teacherAlreadyAllowed = teachersData.teachers.includes(courseDstAddress);
          console.log("teacher addresses for", student.studentid, "are", teachersData.teachers);
          console.log("Is teacher already allowed?", teacherAlreadyAllowed);
          //If not add him
          if (!teacherAlreadyAllowed) {
            try {
              const validationResponse = await fetch("http://localhost:4000/addTeacherToTranscript", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  addressTeacher: participantAddress,
                  addressUniversity: uniAddress,
                  addressStudent: data.addressid
                }),
              });
  
              if (!validationResponse.ok) {
                const errorText = await validationResponse.text();
                console.error(`Failed to add validation for student ${student.studentid}. Status: ${validationResponse.status}`, errorText);
              } else {
                console.log(`Validation successfully added for student ${student.studentid}`);
              }
            } catch (error) {
              console.error(`Network or server error while adding validation for student ${student.studentid}:`, error);
            }
          }

          //add the courseDstTeacher to the teachers that can modify the student's transcript
          try {
            const validationResponse = await fetch("http://localhost:4000/addTeacherToTranscript", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                addressTeacher: courseDstAddress,
                addressUniversity: uniAddress,
                addressStudent: data.addressid
              }),
            });

            if (!validationResponse.ok) {
              const errorText = await validationResponse.text();
              console.error(`Failed to add validation for student ${student.studentid}. Status: ${validationResponse.status}`, errorText);
            } else {
              console.log(`Validation successfully added for student ${student.studentid}`);
            }
          } catch (error) {
            console.error(`Network or server error while adding validation for student ${student.studentid}:`, error);
          }
        } else {
          console.warn(`No address found for student ${student.studentid}`);
        }
      } catch (err) {
        console.error(`Error fetching address for student ${student.studentid}:`, err);
      }
    }

    console.log("Collected student addresses:", studentAddresses);
  };
  
    
  // Function to confirm validation after selecting month and year
  const handleConfirmValidation = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select a month and year before confirming.");
      return;
    }
    const valP= `${selectedMonth}-${selectedYear}`;

    const data = selectedValidation;



    // Blockchain call 
    const courseSrc = `${data.unicodesrc}, ${data.degreeidsrc}, ${data.courseidsrc}`;
    const courseDst = `${data.unicodedst}, ${data.degreeiddst}, ${data.courseiddst}`;
    let tokenId;
    try{
      const response = await fetch("http://localhost:4000/addValidation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: participantAddress,
        srcCour: courseSrc,
        dstCour: courseDst,
        _month: selectedMonth,
        _year: selectedYear
      }),
    });
    const data = await response.json();
    if(!data.success)
      throw new Error(`Failed to add Validation Status: ${response.status}`);
    console.log("data result", data.result);
    tokenId = data.result;
    }catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
      return;
    }
    
    // Make the PUT request to update validation
    fetch(`http://localhost:5000/api/validations/${data.unicodesrc}/${data.degreeidsrc}/${data.courseidsrc}/${data.unicodedst}/${data.degreeiddst}/${data.courseiddst}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token:tokenId, period: valP, provisional: 1 }),
    })
    .then(response => response.json())
    .then(data => {
      setRefreshKey(prev => prev + 1);
      console.log("Successfully updated provisional:", data);
      closeModal();
    })
    .catch(error => console.error("Error updating provisional:", error));


    console.log(`Confirmed validation for Month: ${selectedMonth}, Year: ${selectedYear}`);
  };

  const handleCancelPetition = (valid) =>{
    console.log("Validation:", valid);
    fetch(`http://localhost:5000/api/validations/${valid.unicodesrc}/${valid.degreeidsrc}/${valid.courseidsrc}/${valid.unicodedst}/${valid.degreeiddst}/${valid.courseiddst}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provisional: 5 }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update provisional. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setRefreshKey(prev => prev + 1);
        console.log("Successfully updated provisional:", data);
        setFilteredValidations(prevValidations => prevValidations.map(v =>
	      	v.unicodesrc === valid.unicodesrc &&
	      	v.degreeidsrc === valid.degreeidsrc &&
	      	v.courseidrc === valid.courseidrc &&
	      	v.unicodedst === valid.unicodedst &&
	      	v.degreeiddst === valid.degreeiddst &&
	      	v.courseiddst === valid.courseiddst
	      		? { ...v, provisional: 5}
	      			: v
	      		)
      	);
      })
      .catch(error => console.error("Error updating provisional:", error));

     
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
                <th style={thStyle}>Number of Current Petitions</th>
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
                  <td style={tdStyle}>{valid.num_validations}</td>
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
                        <button style={buttonStyle} onClick={() => handleCancelPetition(valid)}>
                          Cancel
                        </button>
                      </td>
                      <td>
                        {valid.provisional === 3 ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>Suggestion: Accept</span>
                        ) : valid.provisional === 4 ? (
                          <span style={{ color: "red", fontWeight: "bold" }}>Suggestion: Reject</span>
                        ) : (
                          <button style={buttonStyle} onClick={() => handleAskCourseTeacher(valid)}>
                            Ask Course Teacher
                          </button>
                        )}
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
