import React from 'react';

const StudentProfileBody= ({studentId}) => {
/* //Call to get all the data from the student
  fetch(`http://localhost:5000/api/students/${studentId}`)
  .then((response) => response.json())
      .then((data) => setStudent(data))
      .catch((error) => console.error("Error fetching student's courses:", error));


  // create a table that dispays the name, studentid, dob, hash with a button that allows to change the user and the password(has to specify the old and the new one)
  //  and academic year  
  */

  return (
    <div>
      <p> Student Profile</p>
    </div>
  );
};

export default StudentProfileBody;
