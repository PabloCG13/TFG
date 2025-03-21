const db = require("../config/db.js"); // Import pg-promise instance

// Create university
exports.create = async (req, res) => {
    try {
        const { uniCode, name, location, hash } = req.body;
        const query = `
            INSERT INTO university (uniCode, name, location, hash)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const university = await db.one(query, [uniCode, name, location, hash]);
        res.status(201).json(university);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all universities
exports.findAll = async (req, res) => {
    try {
        const universities = await db.any("SELECT * FROM university;");
        res.status(200).json(universities);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one university by code
exports.findOne = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const university = await db.oneOrNone("SELECT * FROM university WHERE uniCode = $1;", [uniCode]);

        if (!university) {
            return res.status(404).json({ message: "University not found" });
        }

        res.status(200).json(university);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all students enrolled in a given university
exports.getStudents = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const students = await db.any(`
            SELECT DISTINCT s.studentId, s.name, s.dob, s.lastAccess
            FROM student s
            JOIN studies st ON s.studentId = st.studentId
            WHERE st.uniCode = $1;
        `, [uniCode]);

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

exports.findUniversitiesExcluding = async (req, res) => {
    try {
        // Extract the list of uniCodes to exclude from request body
        const { uniCodes } = req.body;

        if (!uniCodes || !Array.isArray(uniCodes) || uniCodes.length === 0) {
            return res.status(400).json({ message: "Invalid or empty uniCode array" });
        }

        // Query to fetch universities excluding the provided uniCodes
        const universities = await db.any(`
            SELECT * FROM university 
            WHERE uniCode NOT IN ($1:csv);
        `, [uniCodes]);


        res.status(200).json(universities);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};


// Get all teachers teaching at a given university
exports.getTeachers = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const teachers = await db.any(`
            SELECT DISTINCT t.teacherId, t.name, t.lastAccess, c.courseId, c.name as courseName
            FROM teacher t
            JOIN course c ON t.teacherId = c.teacherId
            WHERE c.uniCode = $1
            UNION
            SELECT DISTINCT t.teacherId, t.name, t.lastAccess, d.degreeId, d.name as degreeName
            FROM teacher t
            JOIN degree d ON t.teacherId = d.teacherId
            WHERE d.uniCode = $1;
        `, [uniCode]);

        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all degrees offered by a given university
exports.getDegrees = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const degrees = await db.any(`
            SELECT d.unicode, d.degreeId, d.name, d.teacherId
            FROM degree d
            WHERE d.uniCode = $1;
        `, [uniCode]);

        res.status(200).json(degrees);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all courses offered by a given university
exports.getCourses = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const courses = await db.any(`
            SELECT c.degreeId, c.courseId, c.name, c.credits, c.period, c.teacherId, c.syllabus_pdf
            FROM course c
            WHERE c.uniCode = $1;
        `, [uniCode]);

        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a University by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCode } = req.params;
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
        
        values.push(uniCode);
        
        const query = `
            UPDATE university
            SET ${setClauses.join(", ")}
            WHERE uniCode = $${index} RETURNING *;`;
        
        const university = await db.oneOrNone(query, values);

        if (!university) {
            return res.status(404).json({ message: "Cannot update University (not found)" });
        }

        res.status(200).json({ message: "University updated successfully", university });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a University by the code in the request
exports.delete = async (req, res) => {
    try {
        const { uniCode } = req.params;
        const result = await db.result("DELETE FROM university WHERE uniCode = $1;", [uniCode]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete University (not found)" });
        }

        res.status(200).json({ message: "University deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
