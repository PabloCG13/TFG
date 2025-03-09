import React from "react";
import CoordinatorTeacherConfirmValidationHeader from "./CoordinatorTeacherConfirmValidationsHeader"; 
import CoordinatorTeacherConfirmValidationBody from "./CoordinatorTeacherConfirmValidationsBody"; 
import CoordinatorTeacherConfirmValidationFooter from "./CoordinatorTeacherConfirmValidationsFooter"; 
import  { useParams } from "react-router-dom";

const CoordinatorTeacherConfirmValidation = () => {
  const  {teacherId} = useParams();
  return (
    <div>
      <CoordinatorTeacherConfirmValidationHeader teacherId = {teacherId}/>
      <CoordinatorTeacherConfirmValidationBody teacherId={teacherId}/>
      <CoordinatorTeacherConfirmValidationFooter />
    </div>
  );
};

export default CoordinatorTeacherConfirmValidation;