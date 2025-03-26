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
      body: JSON.stringify({ ...JSON.parse(validatid), studentId: studentId, provisional: 0}), // Añadir hash al body
    });

    if (!dbResponseValidates.ok) {
      console.error(`Failed to add validate entry to DB. Status: ${dbResponseValidates.status}`);
      return false;
    }



  };



  const handleChoosePetition = async (validatid) =>{
    console.log("He pulsado el boton de Choose");
    console.log("Validation selected:",validatid);
	
   //TODO añadir validation al transcript. Se asume que el usuario sabe lo que hace. Hay que añadir a la estructura de studentTranscript también para que desaparezca el boton de choose. Además, hay que poner un academic year.



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
