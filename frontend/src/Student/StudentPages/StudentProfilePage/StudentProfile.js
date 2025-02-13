import React from "react";
import StudentProfileHeader from "./StudentProfileHeader"; 
import StudentProfileBody from "./StudentProfileBody"; 
import StudentProfileFooter from "./StudentProfileFooter"; 

const StudentProfile = () => {
  return (
    <div>
      <StudentProfileHeader />
      <StudentProfileBody />
      <StudentProfileFooter />
    </div>
  );
};

export default StudentProfile;