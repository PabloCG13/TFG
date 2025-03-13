import React from "react";
import StudentValidationListAskForValidationHeader from "./StudentValidationListAskForValidationHeader"; 
import StudentValidationListAskForValidationBody from "./StudentValidationListAskForValidationBody"; 
import StudentValidationListAskForValidationFooter from "./StudentValidationListAskForValidationFooter"; 
import  { useParams } from "react-router-dom";

const StudentValidationListAskForValidation = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentValidationListAskForValidationHeader studentId={studentId}/>
      <StudentValidationListAskForValidationBody studentId={studentId}/>
      <StudentValidationListAskForValidationFooter />
    </div>
  );
};

export default StudentValidationListAskForValidation;