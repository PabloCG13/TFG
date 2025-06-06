module.exports = app => {
    const courses = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
    
    // Create a new course
    router.post("/courses/", courses.uploadPdf, courses.create);
    
    // Get all courses
    router.get("/courses/", courses.findAll);

    // Get the courses that a teacher teaches
    router.get("/courses/teacher/:teacherId",courses.findTeachersCourse);

    // Get the courses that a university offers
    router.get("/courses/university/:uniCode",courses.findUniversityCourses);

    //Get the course of a degree
    router.get("/courses/degree/:uniCode/:degreeId",courses.findDegreeCourses);

    router.get("/courses/degree/teachers/:uniCode/:degreeId",courses.findTeachersInDegreeCourses);

    router.get("/courses/remaining/:uniCode/:degreeId/:studentId", courses.findRemainingCoursesForStudent);
    
    // Get a certain course by its uniCode, degreeId and courseId
    router.get("/courses/:uniCode/:degreeId/:courseId", courses.findOne);
    
    // Update a course by its uniCode, degreeId and courseId
    router.put("/courses/:uniCode/:degreeId/:courseId", courses.update);
    
    // Delete a course by its uniCode, degreeId and courseId
    router.delete("/courses/:uniCode/:degreeId/:courseId", courses.delete);
  
    app.use('/api', router);
};
