const db = require("../config/db.js"); // Import pg-promise instance

// Create studies
exports.create = async (req, res) => {
    try {
        const { studentId, uniCode, degreeId } = req.body;
        const query = `
            INSERT INTO studies (studentId, uniCode, degreeId)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const studies = await db.one(query, [studentId, uniCode, degreeId]);
        res.status(201).json(studies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all studiess
exports.findAll = async (req, res) => {
    try {
        const studiess = await db.any("SELECT * FROM studies;");
        res.status(200).json(studiess);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one studies by code
exports.findOne = async (req, res) => {
    try {
        const { studentId, uniCode, degreeId } = req.params;
        const studies = await db.oneOrNone("SELECT * FROM studies WHERE studentId = $1 AND uniCode = $2 AND degreeId = $3;", [studentId, uniCode, degreeId]);

        if (!studies) {
            return res.status(404).json({ message: "Studies not found" });
        }

        res.status(200).json(studies);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a studies by the code in the request
exports.update = async (req, res) => {
    try {
        const { studentId, uniCode, degreeId } = req.params;
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
        
        values.push(studentId, uniCode, degreeId); //TODO check syntax
        
        const query = `
            UPDATE studies
            SET ${setClauses.join(", ")}
            WHERE studentId = $${index} AND uniCode = $${index + 1} AND degreeId = $${index + 2} RETURNING *;`;
        
        const studies = await db.oneOrNone(query, values);

        if (!studies) {
            return res.status(404).json({ message: "Cannot update studies (not found)" });
        }

        res.status(200).json({ message: "Studies updated successfully", studies });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a studies by the code in the request
exports.delete = async (req, res) => {
    try {
        const { studentId, uniCode, degreeId } = req.params;
        const result = await db.result("DELETE FROM studies WHERE studentId = $${index} AND uniCode = $${index + 1} AND degreeId = $${index + 2};", [studentId, uniCode, degreeId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete studies (not found)" });
        }

        res.status(200).json({ message: "Studies deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
