import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentUniversityInformationBody= ({studentId}) => {
    const [degrees, setDegrees] = useState([]);
    const [university, setUniversity] = useState([]);
    const location = useLocation();
    const { participantAddress } = location.state || {}; // Extract participantAddress
    useEffect(() => {
   // Get the info about the degree in whcih the student studies
    fetch(`http://localhost:5000/api/studies/${studentId}`)
    .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch courses. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => { // This will likely need to be an array but we will deal with that later for now it just needs to work for one degree
           
            const uniCode = data.unicode;
            if (!uniCode) {
                throw new Error("unicode is missing in API response");
            }
            // Fetch university details
            return fetch(`http://localhost:5000/api/universities/${uniCode}`) 
             .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch university. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(uniData => {
                console.log("Fetched University Data:", uniData);
                setUniversity(uniData); // Set university state

                // Now fetch degrees belonging to this university
                return fetch(`http://localhost:5000/api/universities/${data.uniCode}/degrees`);
            });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch degrees. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(degreesData => {
        console.log("Fetched Degrees Data:", degreesData);
        setDegrees(degreesData); // Set degrees state
    })
    .catch(error => console.error("Error:", error));


    //Create a table that first shows all the info of the univeristy name, id and location and then show all degrees 
    // associated to the university and the degreeCoordinator
  
    }, [studentId]);

  return (
    <div>
      <p> Student University Information</p>
    </div>
  );
};



export default StudentUniversityInformationBody;
