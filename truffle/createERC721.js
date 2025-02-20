const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);


const contractAddress = "0x2612Af3A521c2df9EAF28422Ca335b04AdF3ac66";

const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function main() {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    console.log("Account used:", owner);
    try {
        const tx = await contract.methods.createValidation().send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

}

main().catch(console.error);
