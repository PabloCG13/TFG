const db = require("../config/db.js"); // Import pg-promise instance

// Create validates
exports.create = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId } = req.body;
        const query = `
            INSERT INTO validates (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const validates = await db.one(query, [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId]);
        res.status(201).json(validates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all validates
exports.findAll = async (req, res) => {
    try {
        const validates = await db.any("SELECT * FROM validates;");
        res.status(200).json(validates);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all validates that belong to a certain university and degree
exports.findAllValidationsForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const validates = await db.any(`
        SELECT * FROM validates 
        WHERE studentId = $1;`
        , [studentId]);

        /*if (!validates) {
            return res.status(404).json({ message: "validates not found" });
        }*/

        res.status(200).json(validates);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one validates by code
exports.findOne = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId } = req.params;
        const validates = await db.oneOrNone("SELECT * FROM validates WHERE uniCodeSrc = $1 AND degreeIdSrc = $2 AND courseIdSrc = $3 AND uniCodeDst = $4 AND degreeIdDst = $5 AND courseIdDst = $6 AND studentId = $7;", [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId]);

        if (!validates) {
            return res.status(404).json({ message: "validates not found" });
        }

        res.status(200).json(validates);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a validates by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId } = req.params;
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
        
        values.push(uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId);
        
        const query = `
            UPDATE validates
            SET ${setClauses.join(", ")}
            WHERE uniCodeSrc = $${index} AND degreeIdSrc = $${index + 1} AND courseIdSrc = $${index + 2} AND uniCodeDst = $${index + 3} AND degreeIdDst = $${index + 4} AND courseIdDst = $${index + 5} AND studentId = $${index + 6} RETURNING *;`;
        
        const validates = await db.oneOrNone(query, values);

        if (!validates) {
            return res.status(404).json({ message: "Cannot update validates (not found)" });
        }

        res.status(200).json({ message: "validates updated successfully", validates });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a validates by the code in the request
exports.delete = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId } = req.params;
        const result = await db.result("DELETE FROM validates WHERE uniCodeSrc = $1 AND degreeIdSrc = $2 AND courseIdSrc = $3 AND uniCodeDst = $4 AND degreeIdDst = $5 AND courseIdDst = $6 AND studentId = $7;", [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete validates (not found)" });
        }

        res.status(200).json({ message: "validates deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
