import React from "react";
import UniversityStudentsHeader from "./UniversityStudentsHeader"; 
import UniversityStudentsBody from "./UniversityStudentsBody"; 
import UniversityStudentsFooter from "./UniversityStudentsFooter"; 

const UniversityStudents = () => {
  return (
    <div>
      <UniversityStudentsHeader />
      <UniversityStudentsBody />
      <UniversityStudentsFooter />
    </div>
  );
};

export default UniversityStudents;