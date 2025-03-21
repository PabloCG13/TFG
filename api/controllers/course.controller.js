const db = require("../config/db.js"); // Import pg-promise instance
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create course
exports.create = async (req, res) => {
    try {
	console.log("Course request body ", req.body);
	console.log("Course request file ", req.file);
        const { uniCode, degreeId, courseId, name, content, credits, period, teacherId } = req.body;
        const syllabusPdf = req.file.buffer;
        const query = `
            INSERT INTO course (uniCode, degreeId, courseId, name, content, credits, period, teacherId, syllabus_pdf)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;

        const course = await db.one(query, [
            uniCode, degreeId, courseId, name, content, credits, period, teacherId, syllabusPdf
        ]);

        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadPdf = upload.single('syllabus_pdf');

// Get all courses
exports.findAll = async (req, res) => {
    try {
        const courses = await db.any("SELECT * FROM course;");
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one course by teacherId
exports.findTeachersCourse = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const course = await db.oneOrNone("SELECT * FROM course WHERE teacherId = $1", [teacherId]);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};


// Get one course by unicode
exports.findUniversityCourses = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const course = await db.any("SELECT * FROM course WHERE uniCode = $1", [uniCode]);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
	console.log(course);
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

exports.findDegreeCourses = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;
        const course = await db.any("SELECT * FROM course WHERE uniCode = $1 AND degreeId = $2", [uniCode, degreeId]);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one course by code
exports.findOne = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId } = req.params;
        const course = await db.oneOrNone(
            "SELECT *, encode(syllabus_pdf, 'base64') AS syllabus_pdf FROM course WHERE uniCode = $1 AND degreeId = $2 AND courseId = $3;",
            [uniCode, degreeId, courseId]
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get remaining courses in the degree the student is enrolled in
exports.findRemainingCoursesForStudent = async (req, res) => {
    try {
        const { uniCode, degreeId, studentId } = req.params;
        const course = await db.any(`
        WITH 
        student_transcripts AS (
            -- Get all courses the student has taken in the same degree
            SELECT uniCode, degreeId, courseId
            FROM transcript
            WHERE studentId = $3
        ),
        external_transcripts AS (
            -- Get all transcripts for the student but in different universities/degrees
            SELECT uniCode, degreeId, courseId
            FROM transcript
            WHERE studentId = $3
            AND (uniCode, degreeId) NOT IN (SELECT uniCode, degreeId FROM student_transcripts)
        ),
        validated_courses AS (
            -- Find all courses validated based on previous external transcripts
            SELECT v.uniCodeSrc AS uniCode, v.degreeIdSrc AS degreeId, v.courseIdSrc AS courseId
            FROM validation v
            JOIN external_transcripts et ON v.uniCodeDst = et.uniCode 
                                          AND v.degreeIdDst = et.degreeId 
                                          AND v.courseIdDst = et.courseId
        )
        SELECT *
        FROM course
        WHERE uniCode = $1 
        AND degreeId = $2
        AND (uniCode, degreeId, courseId) NOT IN (
            SELECT uniCode, degreeId, courseId FROM student_transcripts
        )
        AND (uniCode, degreeId, courseId) NOT IN (
            SELECT uniCode, degreeId, courseId FROM validated_courses
        );
        `, [uniCode, degreeId, studentId]);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a course by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId } = req.params;
        const updates = req.body;

	if (!updates || Object.keys(updates).length === 0) {
		return res.status(400).json({message: "Update data missing"});
	}
        let setClauses = [];
        let values = [];
        let index = 1;
        
        for (let key in updates) {
        	setClauses.push(`${key} = $${index}`);
        	values.push(updates[key]);
        	index++;
        }
        
        values.push(uniCode, degreeId, courseId);
        
        const query = `
            UPDATE course
            SET ${setClauses.join(", ")}
            WHERE uniCode = $${index} AND degreeId = $${index + 1} AND courseId = $${index + 2} RETURNING *;`;
        
        const course = await db.oneOrNone(query, values);

        if (!course) {
            return res.status(404).json({ message: "Cannot update course (not found)" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a course by the code in the request
exports.delete = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId } = req.params;
        const result = await db.result("DELETE FROM course WHERE uniCode = $1 AND degreeId = $2 AND courseId = $3;", [uniCode, degreeId, courseId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete course (not found)" });
        }

        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
