import React from "react";
import CourseTeacherHomeHeader from "./CourseTeacherHomeHeader"; 
import CourseTeacherHomeBody from "./CourseTeacherHomeBody"; 
import CourseTeacherHomeFooter from "./CourseTeacherHomeFooter"; 

const CourseTeacherHome = () => {
  return (
    <div>
      <CourseTeacherHomeHeader />
      <CourseTeacherHomeBody />
      <CourseTeacherHomeFooter />
    </div>
  );
};

export default CourseTeacherHome;