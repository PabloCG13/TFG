const db = require("../config/db.js"); // Import pg-promise instance

// Create transcript
exports.create = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId, studentId, academicYear, provisional, mark, lastAccess, teacherId } = req.body;
        const query = `
            INSERT INTO transcript (uniCode, degreeId, courseId, studentId, academicYear, provisional, mark, lastAccess, teacherId)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;
        const transcript = await db.one(query, [uniCode, degreeId, courseId, studentId, academicYear, provisional, mark, lastAccess, teacherId]);
        res.status(201).json(transcript);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all transcripts
exports.findAll = async (req, res) => {
    try {
        const transcripts = await db.any("SELECT * FROM transcript;");
        res.status(200).json(transcripts);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

exports.findStudent = async (req,res) => {
    try{
        const { studentId } = req.params;
        const transcripts = await db.any(`SELECT * FROM transcript WHERE studentId = $1`, [studentId]);
        
        if (transcripts.length === 0) {
            return res.status(404).json({ message: "No courses found for this student" });
        }

        res.status(200).json(transcripts);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
}

exports.findStudentsInCourse = async (req,res) => {
	try{
    	const { courseId } = req.params;
    	const transcripts = await db.any(`SELECT * FROM transcript WHERE courseId = $1`, [courseId]);
   	 
    	if (transcripts.length === 0) {
        	return res.status(404).json({ message: "No courses found for this student" });
    	}

    	res.status(200).json(transcripts);
	} catch (err) {
    	res.status(500).json({ message: err.message || "Some error occurred" });
	}
}


// Get one transcript by code
exports.findOne = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId, studentId, academicYear } = req.params;
        const transcript = await db.oneOrNone("SELECT * FROM transcript WHERE uniCode = $1 AND degreeId = $2 AND courseId = $3 AND studentId = $4 AND academicYear = $5;", [uniCode, degreeId, courseId, studentId, academicYear]);

        if (!transcript) {
            return res.status(404).json({ message: "Transcript not found" });
        }

        res.status(200).json(transcript);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a transcript by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId, studentId, academicYear } = req.params;
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
        
        values.push(uniCode, degreeId, courseId, studentId, academicYear);
        
        const query = `
            UPDATE transcript
            SET ${setClauses.join(", ")}
            WHERE uniCode = $${index} AND degreeId = $${index + 1} AND courseId = $${index + 2} AND studentId = $${index + 3} AND academicYear = $${index + 4} RETURNING *;`;
        
        const transcript = await db.oneOrNone(query, values);

        if (!transcript) {
            return res.status(404).json({ message: "Cannot update transcript (not found)" });
        }

        res.status(200).json({ message: "Transcript updated successfully", transcript });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a transcript by the code in the request
exports.delete = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId, studentId, academicYear } = req.params;
        const result = await db.result("DELETE FROM transcript WHERE uniCode = $1 AND degreeId = $2 AND courseId = $3 AND studentId = $4 AND academicYear = $5;", [uniCode, degreeId, courseId, studentId, academicYear]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete transcript (not found)" });
        }

        res.status(200).json({ message: "Transcript deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

