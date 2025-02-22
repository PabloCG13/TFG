const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";

const contract = new web3.eth.Contract(contractJson.abi, contractAddress);



async function main() {
    //const accounts = await web3.eth.getAccounts();
    //const owner = accounts[0];


    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const teacherAddress = "0xb8b6F379B72c5a0ff295ba3A702FAA2cA5Ed7957";
    const newTeacherAddress = "0x9260D2095df51397485F3ed5a9dCb22Beb05cA84";
    const idValidation = 1;
    console.log("Account Used:", universityAddress);



    try {
        const tx = await contract.methods.transferValidation(idValidation, teacherAddress, newTeacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }


}

main().catch(console.error);
