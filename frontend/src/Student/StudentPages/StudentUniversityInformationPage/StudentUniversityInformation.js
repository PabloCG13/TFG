import React from "react";
import StudentUniversityInformationHeader from "./StudentUniversityInformationHeader"; 
import StudentUniversityInformationBody from "./StudentUniversityInformationBody"; 
import StudentUniversityInformationFooter from "./StudentUniversityInformationFooter"; 
import  { useParams } from "react-router-dom";

const StudentUniversityInformation = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentUniversityInformationHeader />
      <StudentUniversityInformationBody studentId={studentId}/>
      <StudentUniversityInformationFooter />
    </div>
  );
};

export default StudentUniversityInformation;
