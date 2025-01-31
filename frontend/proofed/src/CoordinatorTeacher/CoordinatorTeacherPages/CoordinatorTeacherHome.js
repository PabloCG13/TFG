import React from "react";
import CoordinatorTeacherHomeHeader from "./CoordinatorTeacherHomeHeader"; 
import CoordinatorTeacherHomeBody from "./CoordinatorTeacherHomeBody"; 
import CoordinatorTeacherHomeFooter from "./CoordinatorTeacherHomeFooter"; 

const CoordinatorTeacherHome = () => {
  return (
    <div>
      <CoordinatorTeacherHomeHeader />
      <CoordinatorTeacherHomeBody />
      <CoordinatorTeacherHomeFooter />
    </div>
  );
};

export default CoordinatorTeacherHome;