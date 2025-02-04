

const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0xab804BAE97dD30Cf81d473aD16d1D219BA8C11d0";


const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x"+hash;
}


async function main() {
    const accounts = await web3.eth.getAccounts();
    
    const teacherName = "teacher_1";
    const teacherPass = "987654321a";
    const teacherRole = 3;
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const teacherAddress = "0xb8b6F379B72c5a0ff295ba3A702FAA2cA5Ed7957";

    // Generar hash SHA-256
    const teacherHash = await generateSHA256HashMessage(teacherName, teacherPass);
    console.log("Hash generado para el teacher:", teacherHash);

    try {
       
        const tx = await contract.methods.addParticipant(teacherHash, teacherAddress, teacherRole).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Transacción exitosa:", tx.transactionHash);
    } catch (error) {
        console.error("Error en la transacción:", error);
    }

    
    const storedHash = await contract.methods.personToHash(teacherAddress).call();
    console.log("Hash de la universidad registrada en el contrato:", storedHash);
}

main().catch(console.error);
