const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


/*async function transferValidation(uniAddress, degreeAddr, newDegreeAddr, id) {
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
*/

async function transferValidation(uniAddress, degreeAddr, newDegreeAddr, ids) {
    const universityAddress = uniAddress;
    const teacherAddress = degreeAddr;
    const newTeacherAddress = newDegreeAddr;
    const idList = Array.isArray(ids) ? ids : [ids]; // Asegurarse que es array

    const results = [];

    for (const id of idList) {
        try {
            const tx = await contract.methods
                .transferValidation(id, teacherAddress, newTeacherAddress)
                .send({
                    from: universityAddress,
                    gas: 6721975
                });

            console.log("Successful transaction for id", id, ":", tx.transactionHash);
            results.push({ id, success: true, txHash: tx.transactionHash });
        } catch (error) {
            console.error("Error with id", id, ":", error);
            results.push({ id, success: false, error: error.message });
        }
    }

    return results;
}

// Export the function to be used in another file
module.exports = { transferValidation };