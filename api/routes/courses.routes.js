module.exports = app => {
    const courses = require("../controllers/course.controller.js");
  
    var router = require("express").Router();
  
    router.post("/courses/", courses.create);
  
    router.get("/courses/", courses.findAll);

    router.get("/courses/:teacherId",courses.findTeachersCourse);
  
    router.get("/courses/:uniCode/:degreeId/:courseId", courses.findOne);
  
    router.put("/courses/:uniCode/:degreeId/:courseId", courses.update);
  
    router.delete("/courses/:uniCode/:degreeId/:courseId", courses.delete);
  
    app.use('/api', router);
};