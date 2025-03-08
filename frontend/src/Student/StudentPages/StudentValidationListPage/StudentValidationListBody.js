import React, { useState, useEffect }  from 'react';
import { useLocation } from 'react-router-dom';

const StudentValidationListBody= ({studentId}) => {
  const [Validation, setValidations] = useState([]);
  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress


  /*
      fetch(`http://localhost:5000/api/validations`)
      .then((response) => response.json())
      .then((data) => setValidations(data))
      .catch((error) => console.error("Error fetching student's courses:", error));

      //create a table with all the info of the validation
  */

  useEffect(() => {
    //Call to get all the validations 
    fetch(`http://localhost:5000/api/validations`)
    .then((response) => response.json())
    .then((data) => setValidations(data))
    .catch((error) => console.error("Error fetching validations:", error));
  }, [studentId]);

  return (
    <div>
      <p> Student Validation List</p>
    </div>
  );
};



export default StudentValidationListBody;
