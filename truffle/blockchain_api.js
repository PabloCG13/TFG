const express = require("express");
const cors = require("cors");
const { addUniversity } = require("./addUniversity"); // Keep addUniversity.js in backend
const { addParticipant } = require("./addParticipant");
const { changeParticipant } = require("./changeParticipant");
const { consult } = require("./consult")
const { modifyTranscript } = require("./modifyTranscript")


const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x2612Af3A521c2df9EAF28422Ca335b04AdF3ac66";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

const app = express();
app.use(express.json());
//app.use(cors()); // Allow requests from React frontend
app.use(cors({ origin: "http://localhost:3000" })); // Allow only frontend requests

app.post("/addUniversity", async (req, res) => {
    try {
        const { address, username, password } = req.body;

        if (!address || !username || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await addUniversity(address, username, password);
        
        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to add university" });
        }

        res.json({ success: true, hash: result });
    } catch (error) {
        console.error("Error in /addUniversity:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/addParticipant", async (req, res) => {
    try {
        const { address, uni, user, passwd, role } = req.body;

        if (!address || !uni || !user || !passwd || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await addParticipant(address, uni, user, passwd, role);
        
        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to add participant" });
        }

        res.json({ success: true, hash: result });
    } catch (error) {
        console.error("Error in /addParticipant:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/changeParticipant", async (req, res) => {
    try {
        const { address, user, passwd} = req.body;

        if (!address || !user || !passwd ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await changeParticipant(address, user, passwd);
        
        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to change the hash of the participant" });
        }

        res.json({ success: true, hash: result });
    } catch (error) {
        console.error("Error in /addParticipant:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/consult", async (req, res) => {
    try {
        const { address, user, passwd, type } = req.body;

        if(!address || !user || !passwd || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await consult(address, user, passwd, type);

        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to consult" });
        }
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/modifyTranscript", async (req, res) => {
    const { file, addressStudent, address, type } = req.body;
    
    try {
        const result = await modifyTranscript(file, addressStudent, address, type);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🚀 Run Blockchain Initialization Function Before Starting the Server
async function initializeBlockchain() {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        console.log("Using blockchain account:", owner);

        const tx = await contract.methods.createValidation().send({ 
            from: owner, 
            gas: 6721975 
        });

        console.log("Successfully initialized validation:", tx.transactionHash);
    } catch (error) {
        console.error("Error initializing blockchain:", error);
    }
}

// 🌟 Call this function when the server starts
initializeBlockchain().then(() => {
    const PORT = 4000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

