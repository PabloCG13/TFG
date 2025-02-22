const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x" + hash;
}

async function findFirstUnusedAccount() {
    const accounts = await web3.eth.getAccounts();

    for (const account of accounts) {
        const transactionCount = await web3.eth.getTransactionCount(account);

        if (transactionCount === 0) {
            console.log(`First unused account found: ${account}`);
            return account;
        }
    }

    console.log("No unused accounts found.");
    return null;
}

async function addParticipant(address, uni, user, passwd, role) {
    const participantName = user;
    const participantPass = passwd;
    const participantRole = role;
    const participantAddress = address;// await findFirstUnusedAccount();
    const universityAddress = uni;

    if (!participantAddress) {
        console.error("No available address found.");
        return;
    }

    const participantHash = await generateSHA256HashMessage(participantName, participantPass);
    //console.log("First Student HASH:", participantHash);

    try {
       
        const tx = await contract.methods.addParticipant(participantHash, participantAddress, participantRole).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
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
module.exports = { addParticipant };
