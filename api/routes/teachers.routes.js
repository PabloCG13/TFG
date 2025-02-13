module.exports = app => {
    const teachers = require("../controllers/teacher.controller.js");
  
    var router = require("express").Router();
  
    router.post("/teachers/", teachers.create);
  
    router.get("/teachers/", teachers.findAll);
  
    router.get("/teachers/:teacherId", teachers.findOne);
  
    router.put("/teachers/:teacherId", teachers.update);
  
    router.delete("/teachers/:teacherId", teachers.delete);
  
    app.use('/api', router);
};