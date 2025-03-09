import React from "react";
import StudentHomeHeader from "./StudentHomeHeader"; 
import StudentHomeBody from "./StudentHomeBody"; 
import StudentHomeFooter from "./StudentHomeFooter"; 
import  { useParams } from "react-router-dom";

  
const StudentHome = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentHomeHeader studentId={studentId}/>
      <StudentHomeBody studentId={studentId} />
      <StudentHomeFooter />
    </div>
  );
};

export default StudentHome;