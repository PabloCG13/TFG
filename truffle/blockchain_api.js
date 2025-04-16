const express = require("express");
const cors = require("cors");
const { addUniversity } = require("./addUniversity"); 
const { addParticipant } = require("./addParticipant");
const { changeParticipant } = require("./changeParticipant");
const { consult } = require("./consult");
const { askForTranscript } = require("./askForTranscript");
const { addTeacherToTranscript } = require("./addTeacherToTranscript");
const { getTeachersAllowed } = require("./getTeachersAllowed");
const { revokeTeacherFromTranscript } = require("./revokeTeacherFromTranscript"); 
const { modifyTranscript } = require("./modifyTranscript");
const { addValidation } = require("./addValidation");
const { updateValidation } = require("./updateValidation");
const { transferValidation } = require("./transferValidation");



const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545");
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow only frontend requests


// Creates a new universisty
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

// Creates a new participant
app.post("/addParticipant", async (req, res) => {
    try {
        const { address, uni, user, passwd, role } = req.body;
        
        if (!address || !uni || !user || !passwd || role === undefined || role === null) {
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

// Modifies the user and password of the given participant
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

// Given an user and a password checks if it is same as the stored in the contract
app.post("/consult", async (req, res) => {
    try {
        const { address, user, passwd, role, type } = req.body;

        if(!address || !user || !passwd || !role ||!type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await consult(address, user, passwd, role, type);

        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to consult" });
        }
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get the list of teachers that are allowed to modify the student's Transcrips
app.post("/getTeachersAllowed", async (req, res) => {
    try {
        const { address } = req.body;

        if(!address) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        console.log("Adress", address);
        const result = await getTeachersAllowed(address);

        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to consult" });
        }
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Returns the hash of the given student's Transcripts as well as if it was the same as the content in file
app.post("/askForTranscript", async (req, res) => {
    try {
        const { file, addressStudent } = req.body;
        console.log("Address:", addressStudent)

        if(!file || !addressStudent ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await askForTranscript(file, addressStudent);

        if (result === "Error" || result === null) {
            return res.status(500).json({ error: "Failed to ask" });
        }
        console.log("El result es:", result);

        res.status(200).json({ success: true, result: result.result, hash: result.storedHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Grant access to a student's Transcript for a teacher
app.post("/addTeacherToTranscript", async (req, res) => {
    try {
        const { addressTeacher, addressUniversity, addressStudent } = req.body;

        if(!addressTeacher || !addressUniversity || !addressStudent ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await addTeacherToTranscript(addressTeacher, addressUniversity, addressStudent);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove the access of a given teacher to the student's Transcript
app.post("/revokeTeacherFromTranscript", async (req, res) => {
    try {
        const { addressTeacher, addressUniversity, addressStudent } = req.body;

        if(!addressTeacher || !addressUniversity || !addressStudent ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await revokeTeacherFromTranscript(addressTeacher, addressUniversity, addressStudent);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update the mark of a given student's Transcript
app.post("/modifyTranscript", async (req, res) => {
    try {
        const { file, addressStudent, address, type } = req.body;
        
        if(!file || !addressStudent || !address || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await modifyTranscript(file, addressStudent, address, type);
        res.status(200).json({ success: true, hash: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new validation with the information of the body
app.post("/addValidation", async (req, res) => {
    try {
        const { address, srcCour, dstCour, _month, _year } = req.body;
        console.log("params", req.body);
        if(!address || !srcCour || !dstCour || !_month || !_year) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await addValidation(address, srcCour, dstCour, _month, _year);
        console.log("Result", result);
        res.status(200).json({ success: true, result: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Modify the expiration date in the given tokenId
app.post("/updateValidation", async (req, res) => {
    try {
        const { address, tokenId, _month, _year } = req.body;
        
        if(!address || !tokenId || !_month || !_year) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await updateValidation(address, tokenId, _month, _year);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Transfer ownership of a list of tokens from one address to another
app.post("/transferValidation", async (req, res) => {
    try {
        const { uniAddress, degreeAddr, newDegreeAddr, id } = req.body;

        if(!uniAddress || !degreeAddr || !newDegreeAddr || !id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await transferValidation(uniAddress, degreeAddr, newDegreeAddr, id);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Run Blockchain Initialization Function Before Starting the Server
async function initializeBlockchain() {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        console.log("Using blockchain account:", owner);

        const initialized = await contract.methods.isInitialized().call();
        console.log("Ini",initialized.toString());
        if (initialized.toString() === "1") {
            console.log("Blockchain contract already initialized. Skipping initialization.");
            return;
        }else{
            const tx = await contract.methods.createValidation().send({ 
                from: owner, 
                gas: 6721975 
            });
    
            console.log("Successfully initialized validation:", tx.transactionHash);
        }

        
    } catch (error) {
        console.error("Error initializing blockchain:", error);
    }
}


// Call this function when the server starts
initializeBlockchain().then(() => {
    const PORT = 4000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

