const express = require("express");
const cors = require("cors");
const { addUniversity } = require("./addUni"); // Keep addUniversity.js in backend

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from React frontend

app.post("/addUni", async (req, res) => {
    try {
        const { address, username, password } = req.body;

        if (!address || !username || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await addUniversity(address, username, password);
        res.json({ success: true, hash: result });
    } catch (error) {
        console.error("Error in /addUniversity:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));