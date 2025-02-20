const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x2612Af3A521c2df9EAF28422Ca335b04AdF3ac66";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function addTeacherToTranscript(addressTeacher, addressUniversity, addressStudent) {
    const universityAddress = addressUniversity;
    const teacherAddress = addressTeacher;
    const studentAddress = addressStudent;


    try {
       
        const tx = await contract.methods.addTeacherToTranscript(studentAddress, teacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

}


// Export the function to be used in another file
module.exports = { addTeacherToTranscript };