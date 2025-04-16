const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); 
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x" + hash;
}

async function changeParticipant(address, user, passwd) {
    const participantName = user;
    const participantPass = passwd;
    const participantAddress = address;

    if (!participantAddress) {
        console.error("No available address found.");
        return;
    }

    const participantHash = await generateSHA256HashMessage(participantName, participantPass);

    try {
        const tx = await contract.methods.changeParticipant(participantHash).send({ 
            from: participantAddress, 
            gas: 6721975  
        });
        
        console.log("Successful transaction:", tx.transactionHash);
        const storedHash = await contract.methods.getParticipantHash(participantAddress).call();
        return storedHash;
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { changeParticipant };
