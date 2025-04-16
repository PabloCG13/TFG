const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function addValidation(address, srcCour, dstCour, _month, _year) {
    const srcCourse = srcCour;
    const dstCourse = dstCour;
    const month = _month;
    const year = _year;
    const teacherAddress = address;

    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // Use the first account as owner
        console.log("owner", owner);
        const receipt = await contract.methods.addValidation(teacherAddress, srcCourse, dstCourse, month, year).send({ 
            from: owner, 
            gas: 6721975  
        });
        console.log("returned hash:", receipt);
        const event = receipt.events.ValidationAdded;
        console.log("TokenID:", event.returnValues.tokenId.toString());
        return event.returnValues.tokenId.toString();
    } catch (error) {
        console.error("Error:", error);
        return "Error";
    }
}

// Export the function to be used in another file
module.exports = { addValidation };