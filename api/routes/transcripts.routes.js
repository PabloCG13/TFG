module.exports = app => {
    const transcripts = require("../controllers/transcript.controller.js");
  
    var router = require("express").Router();
  
    router.post("/transcripts/", transcripts.create);
  
    router.get("/transcripts/", transcripts.findAll);

    router.get("/transcripts/:studentId", transcripts.findStudent);

    router.get("/transcripts/notification/:studentId", transcripts.findNotificationStudentMark);

    router.get("/transcripts/erasmus/:uniCode/:degreeId", transcripts.findErasmusStudents);
    
    
    router.get("/transcripts/erasmusTranscript/:studentId", transcripts.findErasmusCoursesForAStudent);
    
    router.get("/transcripts/notification/erasmus/:uniCode/:degreeId", transcripts.findErasmusStudentsWithPendingGrades);

    router.get("/transcripts/students-in-course/:uniCode/:degreeId/:courseId",transcripts.findStudentsInCourse);
  
    router.get("/transcripts/:uniCode/:degreeId/:courseId/:studentId/:academicYear", transcripts.findOne);
  
    router.put("/transcripts/:uniCode/:degreeId/:courseId/:studentId/:academicYear", transcripts.update);
  
    router.delete("/transcripts/:uniCode/:degreeId/:courseId/:studentId/:academicYear", transcripts.delete);
  
    app.use('/api', router);
};
