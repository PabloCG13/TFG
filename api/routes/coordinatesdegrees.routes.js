module.exports = app => {
    const coordinatesdegree = require("../controllers/coordinatesdegree.controller.js");
  
    var router = require("express").Router();
  
    router.post("/coordinatesdegrees/", coordinatesdegree.create);
  
    router.get("/coordinatesdegrees/", coordinatesdegree.findAll);
  
    router.put("/coordinatesdegrees/:teacherId", coordinatesdegree.update);
  
    router.delete("/coordinatesdegrees/:teacherId", coordinatesdegree.delete);
  
    app.use('/api', router);
};