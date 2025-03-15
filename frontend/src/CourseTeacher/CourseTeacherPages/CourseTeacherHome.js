import React from "react";
import CourseTeacherHomeHeader from "./CourseTeacherHomeHeader"; 
import CourseTeacherHomeBody from "./CourseTeacherHomeBody"; 
import CourseTeacherHomeFooter from "./CourseTeacherHomeFooter"; 
import  { useParams } from "react-router-dom";
  

const CourseTeacherHome = () => {
  const  {teacherId} = useParams();
  return (
    <div>
      <CourseTeacherHomeHeader teacherId = {teacherId}/>
      <CourseTeacherHomeBody teacherId = {teacherId}/>
      <CourseTeacherHomeFooter />
    </div>
  );
};

export default CourseTeacherHome;