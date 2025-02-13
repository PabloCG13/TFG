module.exports = app => {
    const degrees = require("../controllers/degree.controller.js");
  
    var router = require("express").Router();
  
    router.post("/degrees/", degrees.create);
  
    router.get("/degrees/", degrees.findAll);
  
    router.get("/degrees/:uniCode/:degreeId", degrees.findOne);
  
    router.put("/degrees/:uniCode/:degreeId", degrees.update);
  
    router.delete("/degrees/:uniCode/:degreeId", degrees.delete);
  
    app.use('/api', router);
};