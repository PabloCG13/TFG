import React from "react";
import CoordinatorTeacherHomeHeader from "./CoordinatorTeacherHomeHeader"; 
import CoordinatorTeacherHomeBody from "./CoordinatorTeacherHomeBody"; 
import CoordinatorTeacherHomeFooter from "./CoordinatorTeacherHomeFooter"; 
import  { useParams } from "react-router-dom";

const CoordinatorTeacherHome = () => {
  const  {teacherId} = useParams();
  return (
    <div>
      <CoordinatorTeacherHomeHeader />
      <CoordinatorTeacherHomeBody teacherId = {teacherId}/>
      <CoordinatorTeacherHomeFooter />
    </div>
  );
};

export default CoordinatorTeacherHome;