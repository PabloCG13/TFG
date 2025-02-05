

const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0xa32C254378997e56767f088661628bf07A7c2F7f";

const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function main() {
    const accounts = await web3.eth.getAccounts();
    
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const teacherAddress = "0xb8b6F379B72c5a0ff295ba3A702FAA2cA5Ed7957";
    const studentAddress = "0xdeEDCf74bD222e4AdED22d05056Ce99587Faa597";


    try {
       
        const tx = await contract.methods.addTeacherToTranscript(studentAddress, teacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Transacción exitosa:", tx.transactionHash);
    } catch (error) {
        console.error("Error en la transacción:", error);
    }

    
    const storedHash = await contract.methods.getAllowedTeachers(studentAddress).call();
    console.log("Hash de la universidad registrada en el contrato:", storedHash);
}

main().catch(console.error);
