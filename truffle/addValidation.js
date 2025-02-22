const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function addValidation(address, srcCourse, dstCourse, month, year) {
    const srcCourse = srcCourse;
    const dstCourse = dstCourse;
    const month = month;
    const year = year;
    const teacherAddress = address;// await findFirstUnusedAccount();

    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // Use the first account as owner

        const tx = await contract.methods.addValidation(teacherAddress, srcCourse, dstCourse, month, year).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("TokenID:", tx);
        const storedHash = tx;
        return storedHash;
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { addValidation };