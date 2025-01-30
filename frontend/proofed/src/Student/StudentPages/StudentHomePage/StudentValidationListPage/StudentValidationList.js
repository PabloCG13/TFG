import React from "react";
import StudentValidationListHeader from "./StudentValidationListHeader"; 
import StudentValidationListBody from "./StudentValidationListBody"; 
import StudentValidationListFooter from "./StudentValidationListFooter"; 

const StudentValidationList = () => {
  return (
    <div>
      <StudentValidationListHeader />
      <StudentValidationListBody />
      <StudentValidationListFooter />
    </div>
  );
};

export default StudentValidationList;