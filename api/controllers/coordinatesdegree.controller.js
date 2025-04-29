const db = require("../config/db.js"); // Import pg-promise instance

// Create degree
exports.create = async (req, res) => {
    try {
        const { teacherId, uniCode, degreeId } = req.body;
        const query = `
            INSERT INTO coordinatesdegree (teacherId, uniCode, degreeId)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const degree = await db.one(query, [teacherId, uniCode, degreeId]);
        res.status(201).json(degree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all degrees
exports.findAll = async (req, res) => {
    try {
        const degrees = await db.any("SELECT * FROM coordinatesdegree;");
        res.status(200).json(degrees);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one degree by code
exports.findOne = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const degree = await db.oneOrNone("SELECT * FROM coordinatesdegree WHERE teacherId = $1;", [teacherId]);

        if (!degree) {
            return res.status(404).json({ message: "Degree not found" });
        }

        res.status(200).json(degree);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a degree by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;
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
            UPDATE coordinatesdegree
            SET ${setClauses.join(", ")}
            WHERE teacherId = $${index} RETURNING *;`;
        
        const degree = await db.oneOrNone(query, values);

        if (!degree) {
            return res.status(404).json({ message: "Cannot update degreecoordinator (not found)" });
        }

        res.status(200).json({ message: "Degree updated successfully", degree });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a degree by the code in the request
exports.delete = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const result = await db.result("DELETE FROM coordinatesdegree WHERE teacherId = $1;", [teacherId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete degree coordinator (not found)" });
        }

        res.status(200).json({ message: "Degree deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
