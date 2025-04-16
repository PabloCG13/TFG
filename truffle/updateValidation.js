const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545");
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
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
            gas: 6721975  
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { updateValidation };