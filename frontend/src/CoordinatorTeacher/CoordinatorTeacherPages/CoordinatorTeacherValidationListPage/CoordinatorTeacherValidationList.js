import React from "react";
import CoordinatorTeacherValidationListHeader from "./CoordinatorTeacherValidationListHeader"; 
import CoordinatorTeacherValidationListBody from "./CoordinatorTeacherValidationListBody"; 
import CoordinatorTeacherValidationListFooter from "./CoordinatorTeacherValidationListFooter"; 
import  { useParams } from "react-router-dom";

const CoordinatorTeacherValidationList = () => {
  const  {teacherId} = useParams();
  return (
    <div>
      <CoordinatorTeacherValidationListHeader teacherId = {teacherId}/>
      <CoordinatorTeacherValidationListBody teacherId={teacherId}/>
      <CoordinatorTeacherValidationListFooter />
    </div>
  );
};

export default CoordinatorTeacherValidationList;