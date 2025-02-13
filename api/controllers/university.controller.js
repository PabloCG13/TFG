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
