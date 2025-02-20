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

import StudentHome from "./Student/StudentPages/StudentHome"; // Import Student Home Page

import StudentTranscript from "./Student/StudentPages/StudentTranscriptPage/StudentTranscript"; // Import Student Transcript Page
import StudentValidationList from "./Student/StudentPages/StudentValidationListPage/StudentValidationList"; // Import Student Validation List Page
import StudentUniversityInformation from "./Student/StudentPages/StudentUniversityInformationPage/StudentUniversityInformation"; // Import Student University Information Page
import StudentProfile from "./Student/StudentPages/StudentProfilePage/StudentProfile"; // Import Student Profile Page

import CourseTeacherHome from "./CourseTeacher/CourseTeacherPages/CourseTeacherHome"; // Import Course Teacher Home Page

import CoordinatorTeacherHome from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherHome"; // Import Coordinator Teacher Home Page

import CoordinatorTeacherValidationList from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList"; // Import Coordinator Teacher Validation List Page
import CoordinatorTeacherConfirmValidation from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationsPage/CoordinatorTeacherConfirmValidations"; // Import Coordinator Teacher Confirm Validations Page
import CoordinatorTeacherConfirmMarks from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks"; // Import Coordinator Teacher Confirm Marks Page

import UniversityHome from "./University/UniversityPages/UniversityHome"; // Import University Home Page


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
        <Route path="/Student/StudentPages/StudentHome" element={<StudentHome />} />


        {/* Student Transcript Page route */}
        <Route path="/Student/StudentPages/StudentTranscriptPage/StudentTranscript" element={<StudentTranscript />} />

        {/* Student Validation List route */}
        <Route path="/Student/StudentPages/StudentValidationListPage/StudentValidationList" element={<StudentValidationList />} />

        {/* Student University Information route */}
        <Route path="/Student/StudentPages/StudentUniversityInformationPage/StudentUniversityInformation" element={<StudentUniversityInformation />} />

        {/* Student Profile route */}
        <Route path="/Student/StudentPages/StudentProfilePage/StudentProfile" element={<StudentProfile />} />


        {/* Course Teacher Home Page route */}
        <Route path="/CourseTeacher/CourseTeacherPages/CourseTeacherHome" element={<CourseTeacherHome />} />


        {/* Coordinator Teacher Home Page route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherHome" element={<CoordinatorTeacherHome />} />


        {/* Coordinator Teacher Validation List Page route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList" element={<CoordinatorTeacherValidationList />} />

        {/* Coordinator Teacher Confirm Validations Page route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationPage/CoordinatorTeacherConfirmValidation" element={<CoordinatorTeacherConfirmValidation />} />

        {/* Coordinator Teacher Confirm Marks Page route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks" element={<CoordinatorTeacherConfirmMarks />} />

        
        {/* University Home Page route */}
        <Route path="/University/UniversityPages/UniversityHome/:uniCode" element={<UniversityHome />} />
        

      </Routes>
    </Router>
  );
}

export default App;
