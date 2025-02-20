const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x2612Af3A521c2df9EAF28422Ca335b04AdF3ac66";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function consult(address, user, passwd, type) {
    if(type == 1){
        const result = await contract.methods.consultUniversity(user, passwd).call({ from: address });
        return result;
    }else{
        const result = await contract.methods.consultParticipant(user, passwd).call({ from: address });
        return result;
    }
}

// Export the function to be used in another file
module.exports = { consult };