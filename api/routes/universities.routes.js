module.exports = app => {
    const universities = require("../controllers/university.controller.js");
  
    var router = require("express").Router();
  
    router.post("/universities/", universities.create);
  
    router.get("/universities/", universities.findAll);
  
    router.get("/universities/:uniCode", universities.findOne);
    
    router.get("/universities/:uniCode/students", universities.getStudents);

    router.get("/universities/:uniCode/teachers", universities.getTeachers);

    router.get("/universities/:uniCode/degrees", universities.getDegrees);

    router.get("/universities/:uniCode/courses", universities.getCourses);
  
    router.put("/universities/:uniCode", universities.update);
  
    router.delete("/universities/:uniCode", universities.delete);
  
    app.use('/api', router);
};
