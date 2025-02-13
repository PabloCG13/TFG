const db = require("../config/db.js"); // Import pg-promise instance

// Create student
exports.create = async (req, res) => { //TODO lastAccess shouldnt be inserted; check if the values $4 syntax is correct 
    try {
        const { studentId, name, dob, transcriptHash, hash } = req.body;
        const query = `
            INSERT INTO student (studentId, name, dob, transcriptHash, hash)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const student = await db.one(query, [studentId, name, dob, transcriptHash, hash]);
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all students
exports.findAll = async (req, res) => {
    try {
        const students = await db.any("SELECT * FROM student;");
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one student by code
exports.findOne = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await db.oneOrNone("SELECT * FROM student WHERE studentId = $1;", [studentId]);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a student by the code in the request
exports.update = async (req, res) => {
    try {
        const { studentId } = req.params;
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
        
        values.push(studentId);
        
        const query = `
            UPDATE student
            SET ${setClauses.join(", ")}
            WHERE studentId = $${index} RETURNING *;`;
        
        const student = await db.oneOrNone(query, values);

        if (!student) {
            return res.status(404).json({ message: "Cannot update student (not found)" });
        }

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a student by the code in the request
exports.delete = async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await db.result("DELETE FROM student WHERE studentId = $1;", [studentId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete student (not found)" });
        }

        res.status(200).json({ message: "Student deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
