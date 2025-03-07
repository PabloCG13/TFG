import React from 'react';
import { useLocation } from 'react-router-dom';

const StudentValidationListBody= ({studentId}) => {

  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress

  /*
      fetch(`http://localhost:5000/api/validations`)
      .then((response) => response.json())
      .then((data) => setValidations(data))
      .catch((error) => console.error("Error fetching student's courses:", error));

      //create a table with all the info of the validation
  */
  return (
    <div>
      <p> Student Validation List</p>
    </div>
  );
};



export default StudentValidationListBody;
