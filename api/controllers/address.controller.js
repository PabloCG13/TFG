const db = require("../config/db.js"); // Import pg-promise instance

// Create address
exports.create = async (req, res) => {
    try {
        const { addressId, participantId} = req.body;
        const query = `
            INSERT INTO address (addressId, participantId)
            VALUES ($1, $2) RETURNING *;
        `;
        const address = await db.one(query, [addressId, participantId]);
        res.status(201).json(address);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all addresses
exports.findAll = async (req, res) => {
    try {
        const addresses = await db.any("SELECT * FROM address;");
        res.status(200).json(addresses);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one address by addressId
exports.findOne = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await db.oneOrNone("SELECT * FROM address WHERE addressId = $1;", [addressId]);
        console.log("Address: ", address);
        
        /*if (!address) {
            return res.status(404).json({ message: "address not found" });
        }*/

        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get one address by participantId
exports.getAddressByParticipant = async (req, res) => {
    try {
        const { participantId } = req.params;
        const address = await db.oneOrNone(`
            SELECT addressId 
            FROM address 
            WHERE participantId = $1;
        `, [participantId]);

        if (!address) {
            return res.status(404).json({ message: "No address found for this participantId" });
        }

        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Get any address where participantId is NULL. Retrieves any free address.
exports.getNullParticipant = async (req, res) => {
    try {
        const address = await db.oneOrNone(`
            SELECT addressId 
            FROM address 
            WHERE participantId IS NULL 
            LIMIT 1;
        `);
        console.log("Address: ", address);
        /*
        if (!address) {
            return res.status(404).json({ message: "No address with NULL participantId found" });
        }
        */
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};



// Update an address by the id in the request
exports.update = async (req, res) => {
    try {
        const { addressId } = req.params;
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
        
        values.push(addressId);
        
        const query = `
            UPDATE address
            SET ${setClauses.join(", ")}
            WHERE addressId = $${index} RETURNING *;`;
        
        const address = await db.oneOrNone(query, values);

        if (!address) {
            return res.status(404).json({ message: "Cannot update address (not found)" });
        }

        res.status(200).json({ message: "Address updated successfully", address });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};

// Delete an address by the id in the request
exports.delete = async (req, res) => {
    try {
        const { addressId } = req.params;
        const result = await db.result("DELETE FROM address WHERE addressId = $1;", [addressId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cannot delete address (not found)" });
        }

        res.status(200).json({ message: "Address deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Some error occurred" });
    }
};
