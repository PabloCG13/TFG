import React from "react";
import CoordinatorTeacherValidationListHeader from "./CoordinatorTeacherValidationListHeader"; 
import CoordinatorTeacherValidationListBody from "./CoordinatorTeacherValidationListBody"; 
import CoordinatorTeacherValidationListFooter from "./CoordinatorTeacherValidationListFooter"; 

const CoordinatorTeacherValidationList = () => {
  return (
    <div>
      <CoordinatorTeacherValidationListHeader />
      <CoordinatorTeacherValidationListBody />
      <CoordinatorTeacherValidationListFooter />
    </div>
  );
};

export default CoordinatorTeacherValidationList;