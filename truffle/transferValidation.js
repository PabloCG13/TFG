const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function transferValidation(uniAddress, degreeAddr, newDegreeAddr, id) {
    const universityAddress = uniAddress;
    const teacherAddress = degreeAddr;
    const newTeacherAddress = newDegreeAddr;
    const idValidation = id;

    try {
        const tx = await contract.methods.transferValidation(idValidation, teacherAddress, newTeacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);

    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { transferValidation };