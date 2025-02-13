import React from "react";
import CoordinatorTeacherConfirmValidationHeader from "./CoordinatorTeacherConfirmValidationsHeader"; 
import CoordinatorTeacherConfirmValidationBody from "./CoordinatorTeacherConfirmValidationsBody"; 
import CoordinatorTeacherConfirmValidationFooter from "./CoordinatorTeacherConfirmValidationsFooter"; 

const CoordinatorTeacherConfirmValidation = () => {
  return (
    <div>
      <CoordinatorTeacherConfirmValidationHeader />
      <CoordinatorTeacherConfirmValidationBody />
      <CoordinatorTeacherConfirmValidationFooter />
    </div>
  );
};

export default CoordinatorTeacherConfirmValidation;