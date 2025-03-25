const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function getTeachersAllowed(addressStudent) {

    const studentAddress = addressStudent;

    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // Use the first account as owner

        const result = await contract.methods.getAllowedTeachers(studentAddress).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
    }

}


// Export the function to be used in another file
module.exports = { getTeachersAllowed };