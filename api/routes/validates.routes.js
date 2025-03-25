module.exports = app => {
    const validates = require("../controllers/validates.controller.js");
  
    var router = require("express").Router();
  
    router.post("/validates/", validates.create);
  
    router.get("/validates/", validates.findAll);

    router.get("/validates/:studentId", validates.findAllValidationsForStudent);

    router.get("/validates/notification/:studentId", validates.findChangedValidationsForStudent);

    router.get("/validates/validation/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validates.findStudentsForValidations);
  
    router.get("/validates/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst/:studentId", validates.findOne);
  
    router.put("/validates/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst/:studentId", validates.update);
  
    router.delete("/validates/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst/:studentId", validates.delete);
  
    app.use('/api', router);
};