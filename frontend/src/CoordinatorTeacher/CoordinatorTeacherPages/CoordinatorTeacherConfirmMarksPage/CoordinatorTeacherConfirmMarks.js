import React from "react";
import CoordinatorTeacherConfirmMarksHeader from "./CoordinatorTeacherConfirmMarksHeader"; 
import CoordinatorTeacherConfirmMarksBody from "./CoordinatorTeacherConfirmMarksBody"; 
import CoordinatorTeacherConfirmMarksFooter from "./CoordinatorTeacherConfirmMarksFooter"; 
import  { useParams } from "react-router-dom";

const CoordinatorTeacherConfirmMarks = () => {
  const  {teacherId} = useParams();
  return (
    <div>
      <CoordinatorTeacherConfirmMarksHeader teacherId = {teacherId}/>
      <CoordinatorTeacherConfirmMarksBody teacherId={teacherId}/>
      <CoordinatorTeacherConfirmMarksFooter />
    </div>
  );
};

export default CoordinatorTeacherConfirmMarks;