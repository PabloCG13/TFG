module.exports = app => {
    const studies = require("../controllers/studies.controller.js");
  
    var router = require("express").Router();
  
    router.post("/studies/", studies.create);
  
    router.get("/studies/", studies.findAll);
  
    router.get("/studies/:studentId/:uniCode/:degreeId", studies.findOne);
  
    router.put("/studies/:studentId/:uniCode/:degreeId", studies.update);
  
    router.delete("/studies/:studentId/:uniCode/:degreeId", studies.delete);
  
    app.use('/api', router);
};