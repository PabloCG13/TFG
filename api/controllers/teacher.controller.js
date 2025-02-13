const db = require("../config/db.js"); // Import pg-promise instance

// Create teacher
exports.create = async (req, res) => { //TODO test if it works, then check if putting lastAccess and not putting any value on the req works (auto null?)
    try {
        const { teacherId, name, hash } = req.body;
        const query = `
            INSERT INTO teacher (teacherId, name, hash)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const teacher = await db.one(query, [teacherId, name, hash]);
        res.status(201).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all teachers
exports.findAll = async (req, res) => {
    try {
        const teachers = await db.any("SELECT * FROM teacher;");
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one teacher by code
exports.findOne = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await db.oneOrNone("SELECT * FROM teacher WHERE teacherId = $1;", [teacherId]);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a teacher by the code in the request
exports.update = async (req, res) => {
    try {
        const { teacherId } = req.params;
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
        
        values.push(teacherId);
        
        const query = `
            UPDATE teacher
            SET ${setClauses.join(", ")}
            WHERE teacherId = $${index} RETURNING *;`;
        
        const teacher = await db.oneOrNone(query, values);

        if (!teacher) {
            return res.status(404).json({ message: "Cannot update teacher (not found)" });
        }

        res.status(200).json({ message: "Teacher updated successfully", teacher });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a teacher by the code in the request
exports.delete = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const result = await db.result("DELETE FROM teacher WHERE teacherId = $1;", [teacherId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete teacher (not found)" });
        }

        res.status(200).json({ message: "Teacher deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
