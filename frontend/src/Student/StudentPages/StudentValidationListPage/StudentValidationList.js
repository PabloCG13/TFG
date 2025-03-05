import React from "react";
import StudentValidationListHeader from "./StudentValidationListHeader"; 
import StudentValidationListBody from "./StudentValidationListBody"; 
import StudentValidationListFooter from "./StudentValidationListFooter"; 
import  { useParams } from "react-router-dom";

const StudentValidationList = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentValidationListHeader />
      <StudentValidationListBody studentId={studentId}/>
      <StudentValidationListFooter />
    </div>
  );
};

export default StudentValidationList;
