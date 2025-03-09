import React from "react";
import StudentTranscriptHeader from "./StudentTranscriptHeader"; 
import StudentTranscriptBody from "./StudentTranscriptBody"; 
import StudentTranscriptFooter from "./StudentTranscriptFooter"; 
import  { useParams } from "react-router-dom";


const StudentTranscript = () => {
  const  {studentId} = useParams();
  return (
    <div>
      <StudentTranscriptHeader studentId={studentId}/>
      <StudentTranscriptBody studentId = {studentId}/>
      <StudentTranscriptFooter />
    </div>
  );
};

export default StudentTranscript;