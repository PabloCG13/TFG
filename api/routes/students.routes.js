module.exports = app => {
    const students = require("../controllers/student.controller.js");
  
    var router = require("express").Router();
  
    router.post("/students/", students.create);
  
    router.get("/students/", students.findAll);
  
    router.get("/students/:studentId", students.findOne);
  
    router.put("/students/:studentId", students.update);
  
    router.delete("/students/:studentId", students.delete);
  
    app.use('/api', router);
};