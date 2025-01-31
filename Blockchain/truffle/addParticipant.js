const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);



const contractAddress = "0x7E69c4d85b00B337d56FdB7ea208d7d318773798";


const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    return crypto.createHash("sha256").update(combinedString).digest("hex");
}


async function main() {
    const accounts = await web3.eth.getAccounts();


    
    const studentName = "alumno_!";
    const studentPass = "1234567hola";
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const studentAddress = "0xdeEDCf74bD222e4AdED22d05056Ce99587Faa597";

    // Generar hash SHA-256
    const studentHash = await generateSHA256HashMessage(studentName, studentPass);
    console.log("Hash generado para la universidad:", studentHash);

    try {
       
        const tx = await contract.methods.addParticipant(studentHash, studentAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Transacción exitosa:", tx.transactionHash);
    } catch (error) {
        console.error("Error en la transacción:", error);
    }

    
    const storedHash = await contract.methods.personToHash(studentAddress).call();
    console.log("Hash de la universidad registrada en el contrato:", storedHash);
}

main().catch(console.error);
