const crypto = require("crypto");
const contractJson = require("../build/contracts/tfg.json");


const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");


const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";

const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function main() {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    console.log("Account used:", owner);
    try {
        const tx = await contract.methods.createValidation().send({ 
            from: owner, 
            gas: 6721975 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

}

main().catch(console.error);
