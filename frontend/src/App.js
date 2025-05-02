import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

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

import StudentAskForValidation from "./Student/StudentPages/StudentValidationListPage/StudentValidationListAskForValidationPage/StudentValidationListAskForValidation"; // Import Student Profile Page

import CourseTeacherHome from "./CourseTeacher/CourseTeacherPages/CourseTeacherHome"; // Import Course Teacher Home Page

import CoordinatorTeacherHome from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherHome"; // Import Coordinator Teacher Home Page

import CoordinatorTeacherValidationList from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList"; // Import Coordinator Teacher Validation List Page
import CoordinatorTeacherConfirmValidation from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationsPage/CoordinatorTeacherConfirmValidations"; // Import Coordinator Teacher Confirm Validations Page
import CoordinatorTeacherConfirmMarks from "./CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks"; // Import Coordinator Teacher Confirm Marks Page

import UniversityHome from "./University/UniversityPages/UniversityHome"; // Import University Home Page


function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const login = () => { setIsAuthenticated(true) };
	const logout = () => { setIsAuthenticated(false) };
	
		


  return (
    <Router>
      <Routes>
        {/* Principal route: Home */}
        
        <Route path="/" element={<Home />} />


        {/* Student Login route */}
        <Route path="/Student/StudentLogin" element={<StudentLogin login = {login} />} />


        {/* Course Teacher Login route */}
        <Route path="/CourseTeacher/CourseTeacherLogin" element={<CourseTeacherLogin login = {login} />} />

        {/* Coordinator Teacher Login route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherLogin" element={<CoordinatorTeacherLogin login = {login} />} />

        {/* University Login route */}
        <Route path="/University/UniversityLogin" element={<UniversityLogin login = {login} />} />


        {/* Student Sign In route */}
        <Route path="/Student/StudentSignIn" element={<StudentSignIn />} />

        {/* Course Teacher Sign In route */}
        <Route path="/CourseTeacher/CourseTeacherSignIn" element={<CourseTeacherSignIn />} />

        {/* Coordinator Teacher Sign In route */}
        <Route path="/CoordinatorTeacher/CoordinatorTeacherSignIn"element={<CoordinatorTeacherSignIn />} />

        {/* University Sign In route */}
        <Route path="/University/UniversitySignIn" element={<UniversitySignIn />} />


        {/* Student Home Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentHome/:studentId" element={<StudentHome />} />
	</Route>

        {/* Student Transcript Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentTranscriptPage/StudentTranscript/:studentId" element={<StudentTranscript />} />
	</Route>
        {/* Student Validation List route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentValidationListPage/StudentValidationList/:studentId" element={<StudentValidationList />} />
	</Route>
        {/* Student University Information route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentUniversityInformationPage/StudentUniversityInformation/:studentId" element={<StudentUniversityInformation />} />
	</Route>
        {/* Student Profile route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentProfilePage/StudentProfile/:studentId" element={<StudentProfile />} />
	</Route>

        {/* Student Ask For Validation Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/Student/StudentPages/StudentValidationListPage/StudentValidationListAskForValidationPage/StudentValidationListAskForValidation/:studentId" element={< StudentAskForValidation/>} />
	</Route>

        {/* Course Teacher Home Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/CourseTeacher/CourseTeacherPages/CourseTeacherHome/:teacherId" element={<CourseTeacherHome />} />
	</Route>

        {/* Coordinator Teacher Home Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherHome/:teacherId" element={<CoordinatorTeacherHome />} />
	</Route>

        {/* Coordinator Teacher Validation List Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherValidationListPage/CoordinatorTeacherValidationList/:teacherId" element={<CoordinatorTeacherValidationList />} />
	</Route>
        {/* Coordinator Teacher Confirm Validations Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmValidationPage/CoordinatorTeacherConfirmValidation/:teacherId" element={<CoordinatorTeacherConfirmValidation />} />
	</Route>
        {/* Coordinator Teacher Confirm Marks Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/CoordinatorTeacher/CoordinatorTeacherPages/CoordinatorTeacherConfirmMarksPage/CoordinatorTeacherConfirmMarks/:teacherId" element={<CoordinatorTeacherConfirmMarks />} />
	</Route>
        
        {/* University Home Page route */}
                        <Route element={<ProtectedRoute isAuthenticated
                                        ={isAuthenticated} />} >
        <Route path="/University/UniversityPages/UniversityHome/:uniCode" element={<UniversityHome />} />
       	</Route> 

      </Routes>
    </Router>
  );
}

export default App;
