module.exports = app => {
    const validations = require("../controllers/validation.controller.js");
  
    var router = require("express").Router();
  
    router.post("/validations/", validations.create);
  
    router.get("/validations/", validations.findAll);
  
    router.get("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.findOne);
  
    router.put("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.update);
  
    router.delete("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.delete);
  
    app.use('/api', router);
};