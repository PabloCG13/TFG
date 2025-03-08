import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentUniversityInformationBody= ({studentId}) => {
    const [degrees, setDegrees] = useState([]);
    const [universities, setUniversities] = useState([]);
    const location = useLocation();
    const { participantAddress } = location.state || {}; // Extract participantAddress
   // Get the info about the degree in whcih the student studies
useEffect(() => {
    if (!studentId) return;

    // Fetch all universities where the student is studying
    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(universitiesData => {
        if (!Array.isArray(universitiesData) || universitiesData.length === 0) {
          throw new Error("No universities found for this student.");
        }

        setUniversities(universitiesData); // Store universities
	console.log(universitiesData);
        // Fetch details and degrees for each university
        return Promise.all(
          universitiesData.map(async (uni) => {
            const uniResponse = await fetch(`http://localhost:5000/api/universities/${uni.unicode}`);
            if (!uniResponse.ok) throw new Error(`Failed to fetch university ${uni.unicode}`);
            const uniData = await uniResponse.json();
		
            const degreesResponse = await fetch(`http://localhost:5000/api/universities/${uni.unicode}/degrees`);
            if (!degreesResponse.ok) throw new Error(`Failed to fetch degrees for ${uni.unicode}`);
            const degreesData = await degreesResponse.json();

            return { uni: uniData, degrees : degreesData };
          })
        );
      })
      .then(results => {
        setUniversities(results.map(r => r.uni)); // Store universities
        setDegrees(prevDegrees => {
        
        const updatedDegrees = { ...prevDegrees };
        results.forEach(({ uni, degrees }) => {
          updatedDegrees[uni.uniCode] = degrees; // Store degrees per university
        });
	console.log(updatedDegrees);
	console.log("degregeee",degrees);
        return updatedDegrees;
      });
      })
      .catch(error => console.error("Error:", error));
  }, [studentId]);

return (
    <div>
      <h2>Student's Universities and Degrees</h2>
      {universities.map((uni) => (
        <div key={uni.uniCode} style={{ marginBottom: "20px", border: "1px solid black", padding: "10px" }}>
          <h3>{uni.name}</h3>
          <p><strong>ID:</strong> {uni.unicode}</p>
          <p><strong>Location:</strong> {uni.location}</p>

          <h4>Degrees</h4>
          <ul>
            {degrees[uni.uniCode]?.map(degree => (
              <li key={degree.degreeId}>{degree.name} - Coordinator: {degree.teacherid}</li>
            )) || <p>No degrees found.</p>}
          </ul>
        </div>
      ))}
    </div>
  );
};


// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
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


export default StudentUniversityInformationBody;
