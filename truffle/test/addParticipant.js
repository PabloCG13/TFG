const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);



const contractAddress = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";


const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x"+hash;
}


async function main() {
    //const accounts = await web3.eth.getAccounts();

    
    const participantName1 = "alumno_1_ucm";
    const participantPass1 = "1234567hola";
    const participantName2 = "alumno_1_bkl";
    const participantPass2 = "bkl4567";
    const participantRole = 1;
    const universityAddress1 = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const universityAddress2 = "0x44e7A1a2a828d234B01c4664a26930c477bf2b72";
    
    const participantAddress1 = "0xdeEDCf74bD222e4AdED22d05056Ce99587Faa597";
    const participantAddress2 = "0x21AA8bac29c1b22a447BfB2d418C9A5B5cBaf282";

    // Generar hash SHA-256
    const participantHash1 = await generateSHA256HashMessage(participantName1, participantPass1);
    console.log("First Student HASH:", participantHash1);
    const participantHash2 = await generateSHA256HashMessage(participantName2, participantPass2);
    console.log("Second Student HASH:", participantHash2);

    try {
       
        const tx1 = await contract.methods.addParticipant(participantHash1, participantAddress1, participantRole).send({ 
            from: universityAddress1, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction::", tx1.transactionHash);

        const tx2 = await contract.methods.addParticipant(participantHash2, participantAddress2, participantRole).send({ 
            from: universityAddress2, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx2.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

    
    const storedHash1 = await contract.methods.personToHash(participantAddress1).call();
    console.log("First Student HASH:", storedHash1);
    const storedHash2 = await contract.methods.personToHash(participantAddress2).call();
    console.log("Second Student HASH:", storedHash2);
}

main().catch(console.error);
