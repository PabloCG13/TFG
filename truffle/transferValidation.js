const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); 
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function transferValidation(uniAddress, degreeAddr, newDegreeAddr, ids) {
    const universityAddress = uniAddress;
    const teacherAddress = degreeAddr;
    const newTeacherAddress = newDegreeAddr;
    const idList = Array.isArray(ids) ? ids : [ids]; 

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