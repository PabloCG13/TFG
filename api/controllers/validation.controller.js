const db = require("../config/db.js"); // Import pg-promise instance

// Create validation
exports.create = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, token, period, provisional } = req.body;
        const query = `
            INSERT INTO validation (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, token, period, provisional)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;
        const validation = await db.one(query, [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, token, period, provisional]);
        res.status(201).json(validation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all validations
exports.findAll = async (req, res) => {
    try {
        const validations = await db.any("SELECT * FROM validation;");
        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all validations that belong to a certain university and degree
exports.findAllValidationsForDegreeinUni = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;
        const validations = await db.any(`
        SELECT * FROM validation 
        WHERE (uniCodeSrc = $1 AND degreeIdSrc = $2)
               OR
              (uniCodeDst = $1 AND degreeIdDst = $2);`
        , [uniCode, degreeId]);

        if (!validations) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};


// Get all confirmed validations that belong to a certain university and degree
// exports.findAllValidationsConfirmedForDegreeinUni = async (req, res) => {
//     try {
//         const { teacherId } = req.params;
//         console.log("TID",teacherId);
//         const validations = await db.any(`
//         SELECT v.* 
//         FROM validation v
//         JOIN
//         coordinatesdegree cd
//         ON 
//             cd.uniCode = v.uniCodeSrc 
//             AND cd.degreeId = v.degreeIdSrc
//         WHERE (cd.teacherId = $1 AND v.provisional = 1);`
//         , [teacherId]);
//         console.log("alid",validations);
//         if (!validations) {
//             return res.status(404).json({ message: "Validation not found" });
//         }

//         res.status(200).json(validations);
//     } catch (err) {
//         res.status(500).json({ message: err.message || "Some error occurred" });
//     }
// };

// Get all validations that belong to a certain university and degree that have not been approved
exports.findConfirmedValidationsForDegreeinUni = async (req, res) => {
    try {
        const { teacherId } = req.params;
        console.log("TID",teacherId);
        const validations = await db.any(`
        SELECT v.* FROM validation v JOIN coordinatesdegree cd ON
        v.uniCodeSrc = cd.uniCode AND v.degreeIdSrc = cd.degreeId
        WHERE (teacherId = $1 AND provisional = 1)
               ;`
          //OR
          //(uniCodeDst = $1 AND degreeIdDst = $2 AND provisional = 1)     
        , [teacherId]);
        if (!validations) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all validations that belong to a certain university and degree that have not been approved/rejected
exports.findAllProvisionalValidationsForDegreeinUni = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;


        const validations = await db.any(`
            SELECT 
                v.*,
                COUNT(val.studentId) AS num_validations
            FROM validation v
            LEFT JOIN validates val
              ON v.uniCodeSrc = val.uniCodeSrc AND
                 v.degreeIdSrc = val.degreeIdSrc AND
                 v.courseIdSrc = val.courseIdSrc AND
                 v.uniCodeDst = val.uniCodeDst AND
                 v.degreeIdDst = val.degreeIdDst AND
                 v.courseIdDst = val.courseIdDst
            WHERE v.uniCodeSrc = $1 AND v.degreeIdSrc = $2 
              AND v.provisional NOT IN (1, 5)
            GROUP BY 
                v.uniCodeSrc, v.degreeIdSrc, v.courseIdSrc,
                v.uniCodeDst, v.degreeIdDst, v.courseIdDst,
                v.token, v.period, v.provisional
            ORDER BY v.uniCodeDst, v.degreeIdDst, v.courseIdDst
        `, [uniCode, degreeId]);


        if (!validations) {
            return res.status(404).json({ message: "No validations found" });
        }


        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get all validations that belong to a certain university and degree that have not been approved/rejected
exports.findComposedValidationsForCourseinUni = async (req, res) => { 
    try {
        const { uniCode, degreeId, courseId, uniCodeDst, degreeIdDst } = req.params;


        const validations = await db.any(`
        (
            SELECT 
                v1.*, v2.*
            FROM 
                validation v1
            JOIN 
                validation v2
                ON v1.uniCodeDst = v2.uniCodeSrc
                AND v1.degreeIdDst = v2.degreeIdSrc
                AND v1.courseIdDst = v2.courseIdSrc
            WHERE 
                v1.uniCodeSrc = $1
                AND v1.degreeIdSrc = $2
                AND v1.courseIdSrc = $3
                AND v2.uniCodeDst = $4
                AND v2.degreeIdDst = $5
                AND NOT EXISTS (
            		SELECT 1
            		FROM validation direct
            		WHERE
            		direct.unicodeSrc = $1
            		AND direct.degreeIdSrc = $2
            		AND direct.courseIdSrc = $3
            		AND direct.uniCodeDst = v1.uniCodeDst
            		AND direct.degreeIdDst = v1.degreeIdDst
            		AND direct.courseIdDst = v1.courseIdDst
            	)
            		
          );   
        `, [uniCode, degreeId, courseId, uniCodeDst, degreeIdDst]);


        if (!validations) {
            return res.status(404).json({ message: "No validations found" });
        }


        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

exports.findInverseValidationsForCourseinUni = async (req, res) => { 
    try {
        const { uniCode, degreeId, courseId, uniCodeDst, degreeIdDst } = req.params;
	console.log("params: ", req.params);
        const validations = await db.any(`
        (
            SELECT 
                v1.*
            FROM 
                validation v1
            WHERE 
                v1.uniCodeSrc = $4
                AND v1.degreeIdSrc = $5
                AND v1.courseIdDst = $3
                AND v1.uniCodeDst = $1
                AND v1.degreeIdDst = $2
                AND NOT EXISTS (
            		SELECT 1
            		FROM validation direct
            		WHERE
            		direct.unicodeSrc = $1
            		AND direct.degreeIdSrc = $2
            		AND direct.courseIdSrc = $3
            		AND direct.uniCodeDst = v1.uniCodeDst
            		AND direct.degreeIdDst = v1.degreeIdDst
            		AND direct.courseIdDst = v1.courseIdDst
            	)
            		
          );   
        `, [uniCode, degreeId, courseId, uniCodeDst, degreeIdDst]);


        if (!validations) {
            return res.status(404).json({ message: "No validations found" });
        }


        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};



// Get all validations that belong to a certain university and degree that have not been approved
exports.findAllNewProvisionalValidationsForDegreeinUni = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;
        const validations = await db.any(`
        SELECT * FROM validation 
        WHERE (uniCodeSrc = $1 AND degreeIdSrc = $2 AND provisional = 0)
               ;`
          //OR
          //(uniCodeDst = $1 AND degreeIdDst = $2 AND provisional = 1)     
        , [uniCode, degreeId]);
        if (!validations) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};




// Get all validations that belong to a certain course that have been asked to a certain teacher
exports.findPendingRequestsForCourse = async (req, res) => {
    try {
        const { uniCode, degreeId, courseId } = req.params;
       

        const validations = await db.any(`
        SELECT * FROM validation 
        WHERE (uniCodeSrc = $1 AND degreeIdSrc = $2 AND courseIdSrc = $3 AND provisional = 2)
               ;`
          //OR
          //(uniCodeDst = $1 AND degreeIdDst = $2 AND provisional = 1)     
        , [uniCode, degreeId, courseId]);
        //console.log("The validations2 are:",validations);
        if (!validations) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};


// Get all validations that belong to a certain university and degree that have been answered by a courseTeacher
exports.findPendingAnswersForDegreeinUni = async (req, res) => {
    try {
        const { uniCode, degreeId } = req.params;
        const validations = await db.any(`
        SELECT * FROM validation 
        WHERE (uniCodeSrc = $1 AND degreeIdSrc = $2 AND provisional = 3)     
          OR
          (uniCodeSrc = $1 AND degreeIdSrc = $2 AND provisional = 4)`     
        , [uniCode, degreeId]);
        //console.log("The validations1 are:",validations);
        if (!validations) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one validation by code
exports.findOne = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst } = req.params;
        const validation = await db.oneOrNone("SELECT * FROM validation WHERE uniCodeSrc = $1 AND degreeIdSrc = $2 AND courseIdSrc = $3 AND uniCodeDst = $4 AND degreeIdDst = $5 AND courseIdDst = $6;", [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst]);

        if (!validation) {
            return res.status(404).json({ message: "Validation not found" });
        }

        res.status(200).json(validation);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Update a validation by the code in the request
exports.update = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst } = req.params;
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
        
        values.push(uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst);
        
        const query = `
            UPDATE validation
            SET ${setClauses.join(", ")}
            WHERE uniCodeSrc = $${index} AND degreeIdSrc = $${index + 1} AND courseIdSrc = $${index + 2} AND uniCodeDst = $${index + 3} AND degreeIdDst = $${index + 4} AND courseIdDst = $${index + 5} RETURNING *;`;
        
        const validation = await db.oneOrNone(query, values);

        if (!validation) {
            return res.status(404).json({ message: "Cannot update validation (not found)" });
        }

        res.status(200).json({ message: "Validation updated successfully", validation });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete a validation by the code in the request
exports.delete = async (req, res) => {
    try {
        const { uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst } = req.params;
        const result = await db.result("DELETE FROM validation WHERE uniCodeSrc = $1 AND degreeIdSrc = $2 AND courseIdSrc = $3 AND uniCodeDst = $4 AND degreeIdDst = $5 AND courseIdDst = $6;", [uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete validation (not found)" });
        }

        res.status(200).json({ message: "Validation deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
