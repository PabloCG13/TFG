const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x" + hash;
}


async function addUniversity(address, user, passwd) {
    const universityName = user;
    const universityPass = passwd;
    const universityAddress = address;

    if (!universityAddress) {
        console.error("No available address found.");
        return;
    }

    const universityHash = await generateSHA256HashMessage(universityName, universityPass);
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // Use the first account as owner

        const tx = await contract.methods.addUniversity(universityHash, universityAddress).send({ 
            from: owner, 
            gas: 6721975
        });

        console.log("Successful transaction:", tx.transactionHash);
        const storedHash = await contract.methods.universityToHash(universityAddress).call();
        return storedHash;
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { addUniversity };