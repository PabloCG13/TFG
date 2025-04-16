const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); 
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function revokeTeacherFromTranscript(addressTeacher, addressUniversity, addressStudent) {
    const universityAddress = addressUniversity;
    const teacherAddress = addressTeacher;
    const studentAddress = addressStudent;

    try {
        const tx = await contract.methods.revokeTeacherFromTranscript(studentAddress, teacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

}

// Export the function to be used in another file
module.exports = { revokeTeacherFromTranscript };