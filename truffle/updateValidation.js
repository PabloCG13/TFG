const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function updateValidation(address, id, _month, _year) {
    const tokenId = id;
    const month = _month;
    const year = _year;
    const teacherAddress = address;

    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // Use the first account as owner
        console.log("owner", owner);
        const tx = await contract.methods.updateValidation(teacherAddress, tokenId, month, year).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { updateValidation };