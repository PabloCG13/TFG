const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); 
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function consult(address, user, passwd, role, type) {
    if(type == 1){
        const result = await contract.methods.consultUniversity(user, passwd).call({ from: address });
        return result;
    }else{
        const result = await contract.methods.consultParticipant(user, passwd, role).call({ from: address });
        return result;
    }
}

// Export the function to be used in another file
module.exports = { consult };