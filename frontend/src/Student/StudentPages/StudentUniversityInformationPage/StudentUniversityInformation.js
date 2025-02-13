import React from "react";
import StudentUniversityInformationHeader from "./StudentUniversityInformationHeader"; 
import StudentUniversityInformationBody from "./StudentUniversityInformationBody"; 
import StudentUniversityInformationFooter from "./StudentUniversityInformationFooter"; 

const StudentUniversityInformation = () => {
  return (
    <div>
      <StudentUniversityInformationHeader />
      <StudentUniversityInformationBody />
      <StudentUniversityInformationFooter />
    </div>
  );
};

export default StudentUniversityInformation;