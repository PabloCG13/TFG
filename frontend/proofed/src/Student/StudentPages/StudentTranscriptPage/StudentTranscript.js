import React from "react";
import StudentTranscriptHeader from "./StudentTranscriptHeader"; 
import StudentTranscriptBody from "./StudentTranscriptBody"; 
import StudentTranscriptFooter from "./StudentTranscriptFooter"; 

const StudentTranscript = () => {
  return (
    <div>
      <StudentTranscriptHeader />
      <StudentTranscriptBody />
      <StudentTranscriptFooter />
    </div>
  );
};

export default StudentTranscript;