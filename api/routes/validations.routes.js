module.exports = app => {
    const validations = require("../controllers/validation.controller.js");
  
    var router = require("express").Router();
  
    router.post("/validations/", validations.create);
  
    router.get("/validations/", validations.findAll);

    router.get("/validations/:uniCode/:degreeId", validations.findAllValidationsForDegreeinUni);
    
    //router.get("/validations/token/:teacherId", validations.findAllValidationsConfirmedForDegreeinUni);

    router.get("/validations/conf/tok/:teacherId", validations.findConfirmedValidationsForDegreeinUni);

    router.get("/validations/provisionals/:uniCode/:degreeId", validations.findAllProvisionalValidationsForDegreeinUni);

    router.get("/validations/provisional/notification/:uniCode/:degreeId", validations.findAllNewProvisionalValidationsForDegreeinUni);

    router.get("/validations/provisional/composed/:uniCode/:degreeId/:courseId/:uniCodeDst/:degreeIdDst", validations.findComposedValidationsForCourseinUni);

    router.get("/validations/provisional/inversed/:uniCode/:degreeId/:courseId/:uniCodeDst/:degreeIdDst", validations.findInverseValidationsForCourseinUni);

    router.get("/validations/provisional/requests/:uniCode/:degreeId/:courseId", validations.findPendingRequestsForCourse);

    router.get("/validations/provisional/answers/:uniCode/:degreeId", validations.findPendingAnswersForDegreeinUni);
    
    router.get("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.findOne);
  
    router.put("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.update);
  
    router.delete("/validations/:uniCodeSrc/:degreeIdSrc/:courseIdSrc/:uniCodeDst/:degreeIdDst/:courseIdDst", validations.delete);
  
    app.use('/api', router);
};