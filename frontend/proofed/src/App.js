import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./HomePage/Home"; // Import Home

import StudentLogin from "./Student/StudentLogin"; // Import Student Login
import CourseTeacherLogin from "./CourseTeacher/CourseTeacherLogin"; // Import Course Teacher Login
import CoordinatorTeacherLogin from "./CoordinatorTeacher/CoordinatorTeacherLogin"; // Import Coordinator Teacher Login
import UniversityLogin from "./University/UniversityLogin"; // Import University Login

import StudentSignIn from "./Student/StudentSignIn"; // Import Student Sign In
import CourseTeacherSignIn from "./CourseTeacher/CourseTeacherSignIn"; // Import Course Teacher Sign In
import CoordinatorTeacherSignIn from "./CoordinatorTeacher/CoordinatorTeacherSignIn"; // Import Coordinator Teacher Sign In
import UniversitySignIn from "./University/UniversitySignIn"; // Import Univesity Sign In

import StudentHome from "./Student/StudentPages/StudentHomePage/StudentHome"; // Import Student Home Page

import StudentTranscript from "./Student/StudentPages/StudentHomePage/StudentTranscriptPage/StudentTranscript"; // Import Student Transcript Page
import StudentValidationList from "./Student/StudentPages/StudentHomePage/StudentValidationListPage/StudentValidationList"; // Import Student Validation List Page
import StudentUniversityInformation from "./Student/StudentPages/StudentHomePage/StudentUniversityInformationPage/StudentUniversityInformation"; // Import Student University Information Page
import StudentProfile from "./Student/StudentPages/StudentHomePage/StudentProfilePage/StudentProfile"; // Import Student Profile Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Principal route: Home */}
        <Route path="/" element={<Home />} />

        {/* Student Login route */}
        <Route path="/Student/StudentLogin" element={<StudentLogin />} />

        {/* Course Teacher Login route */}
        <Route path="/CourseTeacher/CourseTeacherLogin" element={<CourseTeacherLogin />} />

        {/* Coordinator Teacher Login route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherLogin" element={<CoordinatorTeacherLogin />} />

        {/* University Login route */}
        <Route path="/University/UniversityLogin" element={<UniversityLogin />} />

        {/* Student Sign In route */}
        <Route path="/Student/StudentSignIn" element={<StudentSignIn />} />

        {/* Course Teacher Sign In route */}
        <Route path="/CourseTeacher/CourseTeacherSignIn" element={<CourseTeacherSignIn />} />

        {/* Coordinator Teacher Sign In route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherSignIn"element={<CoordinatorTeacherSignIn />} />

        {/* University Sign In route */}
        <Route path="/University/UniversitySignIn" element={<UniversitySignIn />} />

        {/* Student Home Page route */}
        <Route path="/Student/StudentPages/StudentHomePage/StudentHome" element={<StudentHome />} />


        {/* Student Transcript Page route */}
        <Route path="/Student/StudentPages/StudentHomePage/StudentTranscriptPage/StudentTranscript" element={<StudentTranscript />} />

        {/* Student Validation List route */}
        <Route path="/Student/StudentPages/StudentHomePage/StudentValidationListPage/StudentValidationList" element={<StudentValidationList />} />

        {/* Student University Information route */}
        <Route path="/Student/StudentPages/StudentHomePage/StudentUniversityInformationPage/StudentUniversityInformation" element={<StudentUniversityInformation />} />

        {/* Student Profile route */}
        <Route path="/Student/StudentPages/StudentHomePage/StudentProfilePage/StudentProfile" element={<StudentProfile />} />

        
      </Routes>
    </Router>
  );
}

export default App;
