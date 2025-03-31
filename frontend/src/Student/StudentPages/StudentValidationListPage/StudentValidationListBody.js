import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link to redirect

const StudentValidationListBody = ({ studentId }) => {
  const [validations, setValidations] = useState([]);
  const [filteredValidations, setFilteredValidations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueUnicodes, setUniqueUnicodes] = useState([]);
  const [universities, setUniversities] = useState({});
  const [studentTranscript, setStudentTranscript] = useState([]);
  const [studentValidates, setStudentValidates] = useState([]);
  const [studentInfo, setStudentInfo] = useState('');
  const [message, setMessage] = useState(null); // State for error messages
  const location = useLocation();
  const { participantAddress } = location.state || {};

  useEffect(() => {
    if (!studentId) return;

    // Fetch all validations
    fetch(`http://localhost:5000/api/validations`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch validations. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setValidations(data);
        setFilteredValidations(data);

        // Extract unique unicodedst values and fetch university details for each
        const uniqueUnicodesSet = new Set(data.map(v => v.unicodedst));
        setUniqueUnicodes([...uniqueUnicodesSet]);
      })
      .catch(error => console.error("Error fetching validations:", error));
  }, [studentId]);

  useEffect(()=>{//Get the coordinator of the student
    fetch(`http://localhost:5000/api/studies/${studentId}`)
    .then((response) => response.json())
    .then((data) => setStudentInfo(data))
    .catch((error) => console.error("Error fetching student's data:", error));
  }, [studentId]);

  useEffect(() => {
    // Fetch university details for each unique unicodedst
    uniqueUnicodes.forEach(unicodedst => {
      fetch(`http://localhost:5000/api/universities/${unicodedst}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch university for ${unicodedst}. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(uniData => {
          setUniversities(prev => ({
            ...prev,
            [unicodedst]: uniData
          }));
        })
        .catch(error => console.error("Error fetching university:", error));
    });
  }, [uniqueUnicodes]);

  useEffect(() => {
    let results = validations;
    if (searchTerm) {
      results = results.filter((valid) =>
        valid.courseidsrc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (validityPeriod) {
      results = results.filter((valid) => parseInt(valid.period) >= parseInt(validityPeriod));
    }
    if (universityName) {
      results = results.filter((valid) => {
        const university = universities[valid.unicodedst];
        return university && university.name.toLowerCase().includes(universityName.toLowerCase());
      });
    }
    setFilteredValidations(results);
  }, [searchTerm, validityPeriod, universityName, validations, universities]);

  useEffect(() => {

      fetch(`http://localhost:5000/api/validates/${studentId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch student validation petitions for ${studentId}. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setStudentValidates(data))
        .catch(error => console.error("Error fetching student validation petitions:", error));
      fetch(`http://localhost:5000/api/transcripts/erasmusTranscript/${studentId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch erasmus courses in transcript for ${studentId}. Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setStudentTranscript(data))
        .catch(error => console.error("Error fetching student erasmus courses in transcript:", error));
    console.log("validates ",studentValidates);
    console.log("transcript ",studentTranscript);
  }, [studentId]);


  const handleNotifyPetition = async (validatid) =>{
    console.log("He pulsado el boton de Notify");
    console.log("Validation selected:",validatid);

    const dbResponse = await fetch(`http://localhost:5000/api/validates/${studentId}`);


    if (!dbResponse.ok) throw new Error(`Failed to fetch studies. Status: ${dbResponse.status}`);
    
    if(dbResponse.length > 10){ //limite de validations que puedo pedir
      return;
    }
    
    console.log("response: ",dbResponse);

    const dbResponseValidates = await fetch(`http://localhost:5000/api/validates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({       
        uniCodeSrc: validatid.unicodesrc,
        degreeIdSrc: validatid.degreeidsrc,
        courseIdSrc: validatid.courseidsrc,
        uniCodeDst: validatid.unicodedst,
        degreeIdDst: validatid.degreeiddst,
        courseIdDst: validatid.courseiddst,
        studentId: studentId,
        provisional: 0
      }), 
    });

    if (!dbResponseValidates.ok) {
      console.error(`Failed to add validate entry to DB. Status: ${dbResponseValidates.status}`);
      return false;
    }
  };
  
  const handleBlockchain = async (validatid, year, unicodesrc, degreeidsrc, courseidsrc, unicodedst, degreeiddst, courseiddst) => {
    //Get the teacherId of the dstCourse
    const dbDstResponse = await fetch(`http://localhost:5000/api/courses/${unicodedst}/${degreeiddst}/${courseiddst}`);
    const dbDstData = await dbDstResponse.json();
    const teacherDst = dbDstData.teacherid;
    console.log("TeacherDst", teacherDst);

    // Get the address of the teacher of the DstCourse
    const dbResponse = await fetch(`http://localhost:5000/api/addresses/participant/${teacherDst}`);
    const dbData = await dbResponse.json();
  
  
    if (!dbResponse.ok || !dbData.addressid) {
      setMessage("No blockchain address found for this user. Please contact support.");
      console.error("Database error:", dbData);
      return;
    }
  
  
    const courseDstAddress = dbData.addressid;
    console.log("Fetched DstCourse Address from DB:", courseDstAddress);

    // Get the address of the degree coordinator 
    console.log("Studies", studentInfo); //Need to adapt it 
    const uniCode = studentInfo[0].unicode;
    const degreeId = studentInfo[0].degreeid;
    const degreeResponse = await fetch(`http://localhost:5000/api/degrees/${uniCode}/${degreeId}`);
    
    if (!degreeResponse.ok) throw new Error(`Failed to fetch degree ${degreeId} at ${uniCode}`);
    const degreeData = await degreeResponse.json();

    console.log("DegreeCoordinator ID", degreeData.teacherid);

    const dbResponseCoord = await fetch(`http://localhost:5000/api/addresses/participant/${degreeData.teacherid}`);
    const dbDataCoord = await dbResponseCoord.json();
  
    if (!dbResponseCoord.ok || !dbDataCoord.addressid) {
      setMessage("No blockchain address found for this user. Please contact support.");
      console.error("Database error:", dbDataCoord);
      return;
    }
  
    const degreeCoordAddress = dbDataCoord.addressid;
    console.log("Fetched Coordinator Address from DB:", degreeCoordAddress);
  
  
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
    let dbDataStudents;
    try{
      // Get validation entry if not exists then create a new one
      const dbStudentsResponse = await fetch(`http://localhost:5000/api/validates/${unicodesrc}/${degreeidsrc}/${courseidsrc}/${unicodedst}/${degreeiddst}/${courseiddst}/${studentId}`);
      
      dbDataStudents = await dbStudentsResponse.json();
      console.log("Entry in validates:", dbDataStudents);
    }catch(error){
      console.error("Database error:", dbDataStudents); // <-- FIXED: was dbData
      dbDataStudents = JSON.stringify({...JSON.parse(validatid), studentId: studentId, provisional: 1});
    }

  
  
    const student = dbDataStudents;
    console.log("Student", student);
  
      try {
  
          // Get list of allowed teachers
          const teachersResponse = await fetch("http://localhost:4000/getTeachersAllowed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: participantAddress
            }),
          });
  
  
          if (!teachersResponse.ok) {
            console.error(`Failed to fetch teachers for student ${student.studentid}. Status: ${teachersResponse.status}`);
            return;
          }
  
          const teachersData = await teachersResponse.json();
  
          if (!Array.isArray(teachersData.result)) {
            console.error(`Malformed teachers data for student ${student.studentid}`, teachersData);
            return;
          }
          //Check if DegreeCoord is already allowed to modify the transcript of this student
          const teacherAlreadyAllowed = teachersData.result.includes(courseDstAddress);
          console.log("teacher addresses for", student.studentid, "are", teachersData.result);
          console.log("Is teacher already allowed?", teacherAlreadyAllowed);
          //If not add him
          if (!teacherAlreadyAllowed) {
            try {
              const validationResponse = await fetch("http://localhost:4000/addTeacherToTranscript", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  addressTeacher: degreeCoordAddress,
                  addressUniversity: uniAddress,
                  addressStudent: participantAddress
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
                addressStudent: participantAddress
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
      } catch (err) {
        console.error(`Error fetching address for student ${student.studentid}:`, err);
      }
      changeTranscript(unicodesrc, degreeidsrc, courseidsrc, unicodedst,degreeiddst,courseiddst,studentId,year,teacherDst,courseDstAddress,degreeCoordAddress);
  };

  const changeTranscript = async(unicodesrc, degreeidsrc, courseidsrc, uniCode, degreeId, courseId, studentId, year, teacherId, dstCourseAddess, degreeCoordAddress) => {
      console.log("uniCode desde la funcion:", uniCode);
      console.log("degreeID desde la funcion:", degreeId);
      console.log("courseID desde la funcion:", courseId);
      console.log("studentID desde la funcion:", studentId);
      console.log("Year desde la funcion:", year);
      console.log("teacherId desde la funcion:",teacherId);
      console.log("address: dg", degreeCoordAddress, "dstCourse", dstCourseAddess);
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
            erasmus: 1,
            provisional: 0, // Assuming provisional is still part of the request
            teacherId: teacherId,
            uniCodeSrc: unicodesrc,
            degreeIdSrc: degreeidsrc, 
            courseIdSrc: courseidsrc,
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

        
    
        const teacherAddress = dstCourseAddess;
        console.log("Dst Course Address:", teacherAddress);


      const studentAddress = participantAddress;
      console.log("Fetched Student Address:", studentAddress);
      // Step 2: Modify transcript on the blockchain
      const transcriptResponse = await fetch("http://localhost:4000/modifyTranscript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              file: transcriptHash, //cambiar por el return de la llamada a la db del transcript de un estudiante
              addressStudent: studentAddress,
              address: degreeCoordAddress,
              type: 1
          }),
      });
  
      if (!transcriptResponse.ok) {
          throw new Error(`Failed to modify transcript. Status: ${transcriptResponse.status}`);
      }
  
      const transcriptData = await transcriptResponse.json();
      const transcriptHashModified = transcriptData.hash;
      console.log("Transcript modified successfully:", transcriptHashModified);

      const updateResponse = await fetch(`http://localhost:5000/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptHash: transcriptHashModified }),
      });

      if (!updateResponse.ok) {
          throw new Error(`Failed to update student ${studentId}. Status: ${updateResponse.status}`);
      }

      const updateData = await updateResponse.json();
      console.log(`Student ${studentId} updated successfully with transcriptHash:`, updateData);
      } catch (error) {
        console.error("Error:", error.message);
        setMessage(error.message); // Display error to the user
      }
  };


  const handleChoosePetition = async (validatid) =>{
    console.log("He pulsado el boton de Choose");
    console.log("Validation selected:",validatid);
	
   //TODO añadir validation al transcript. Se asume que el usuario sabe lo que hace. Hay que añadir a la estructura de studentTranscript también para que desaparezca el boton de choose. Además, hay que poner un academic year.
   handleBlockchain(validatid,validatid.period, validatid.unicodesrc, validatid.degreeidsrc, validatid.courseidsrc, validatid.unicodedst, validatid.degreeiddst, validatid.courseiddst);


  };


  const handleProvisional = (provisional) =>{
    if (provisional === 0) return "Pending";
    if (provisional === 1) return "Definitive";
    if (provisional === 2) return "Pending coordinator suggestion";
    if (provisional === 3) return "Suggested to be accepted";
    if (provisional === 4) return "Suggested to be rejected";
    if (provisional === 5) return "Rejected";
  };
  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Courses</h2>
          <div style={filterContainer}>
            <input
              type="text"
              placeholder="Search by Course ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowFilters(!showFilters)}>Search Options</button>
          </div>
          {showFilters && (
            <div style={filterContainer}>
              <input
                type="number"
                placeholder="Validity Period (Year)"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
              />
              <select value={universityName} onChange={(e) => setUniversityName(e.target.value)}>
                <option value="">Select University</option>
                {Object.values(universities).map((university) => (
                  <option key={university.unicode} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Origin Course</th>
                <th style={thStyle}>Destination Course</th>
                <th style={thStyle}>Validity Period</th>
                <th style={thStyle}>University Name</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
                {/* TODO: Add a button that only appears if it is provisional 
                and origin course unicode and degreeId is the same */}

                {/*add a filter to only show those destination unis that have button
                */}
              </tr>
            </thead>
            <tbody>
              {filteredValidations.map((validatid) => {
              	const hasTakenCourse = studentTranscript.some(
              		(course) => course.courseid === validatid.courseiddst && course.erasmus === 1);
              	const alreadyWaitingNotification = studentValidates.some(
              	(v) =>
              		v.unicodesrc === validatid.unicodesrc &&
              		v.degreeidsrc === validatid.degreeidsrc &&
              		v.courseidsrc === validatid.courseidsrc &&
              		v.unicodedst === validatid.unicodedst &&
              		v.degreeiddst === validatid.degreeiddst &&
              		v.courseiddst === validatid.courseiddst &&
              		v.provisional !== 1);
              return (
              
                <tr key={validatid.unicode}>
                  <td style={tdStyle}>{validatid.unicodesrc}, {validatid.degreeidsrc}, {validatid.courseidsrc}</td>
                  <td style={tdStyle}>{validatid.unicodedst}, {validatid.degreeiddst}, {validatid.courseiddst}</td>
                  <td style={tdStyle}>{validatid.period}</td>
                  <td style={tdStyle}>
                    {universities[validatid.unicodedst] ? (
                      <div>{universities[validatid.unicodedst].name}</div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </td>
                  <td style={tdStyle}>{handleProvisional(validatid.provisional)}</td>
                  <td>
                  	{validatid.provisional !== 5 && (
                  	  hasTakenCourse ? (
                  	  	<span>Already taken</span>
                  	  ) : alreadyWaitingNotification ? (
                  	  	<span>Pending Notification</span>
                  	  ) : validatid.provisional === 1 ? (
				  <button style={buttonStyle} onClick={() => handleChoosePetition(validatid)}>
				  Choose
				  </button>
                  	  ) : (
				  <button style={buttonStyle} onClick={() => handleNotifyPetition(validatid)}>
				  Notify
				  </button>
			  )
			)}
                </td>
                </tr>
              );
              })}
            </tbody>
          </table>
    
          </div>
          {/*onClick={()=> handleValidation() */}              
          <Link 
          to={`/Student/StudentPages/StudentValidationListPage/StudentValidationListAskForValidationPage/StudentValidationListAskForValidation/${studentId}`}
          state={{ participantAddress }}  // Pass participantAddress
          style={validationListButtonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, validationListButtonStyle)}
        >
          Ask for Validation
        </Link>
        </div>
      </div>
  );
};

const containerStyle = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

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
   
/* Validation List Button */
const validationListButtonStyle = {
  padding: "12px 24px",
  fontSize: "30px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white", 
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  textDecoration: "none"

};

/* Transcript Button */
const buttonStyle = {
  padding: "12px 24px",
  fontSize: "30px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white", 
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  textDecoration: "none"
};

const lockIconStyle = {
  width: '20px',
  height: '20px',
  verticalAlign: 'middle', // Para alinear el ícono con el checkbox
};

/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3", // Changes the background color to a darker blue when the user hover 
};

export default StudentValidationListBody;
