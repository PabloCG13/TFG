import React from "react";
import StudentHomeHeader from "./StudentHomeHeader"; 
import StudentHomeBody from "./StudentHomeBody"; 
import StudentHomeFooter from "./StudentHomeFooter"; 

const StudentHome = () => {
  return (
    <div>
      <StudentHomeHeader />
      <StudentHomeBody />
      <StudentHomeFooter />
    </div>
  );
};

export default StudentHome;