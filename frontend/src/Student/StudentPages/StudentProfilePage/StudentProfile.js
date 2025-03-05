import React from "react";
import StudentProfileHeader from "./StudentProfileHeader"; 
import StudentProfileBody from "./StudentProfileBody"; 
import StudentProfileFooter from "./StudentProfileFooter"; 
import  { useParams } from "react-router-dom";

const StudentProfile = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentProfileHeader />
      <StudentProfileBody studentId={studentId}/>
      <StudentProfileFooter />
    </div>
  );
};

export default StudentProfile;
