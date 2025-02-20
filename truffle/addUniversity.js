const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x2612Af3A521c2df9EAF28422Ca335b04AdF3ac66";
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

async function addUniversity(address, user, passwd) {
    const universityName = user;
    const universityPass = passwd;
    const universityAddress = address;// await findFirstUnusedAccount();

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