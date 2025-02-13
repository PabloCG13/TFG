const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://ganache:8545"); //Container ganache-cli version
//const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0x26Ba181AB99374e1b23d02B328961c1665Bd8666";


const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x"+hash;
}


async function main() {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    console.log("Cuenta usada para la transacción:", owner);

    
    const universityName = "ucm";
    const universityPass = "holaMundo123";
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";

    // Generar hash SHA-256
    const universityHash = await generateSHA256HashMessage(universityName, universityPass);
    console.log("First University HASH:", universityHash);

    try {
       
        const tx1 = await contract.methods.addUniversity(universityHash, universityAddress).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx1.transactionHash);

    } catch (error) {
        console.error("Error:", error);
    }

    
    const storedHash = await contract.methods.universityToHash(universityAddress).call();
    console.log("University Hash:", storedHash);
}

main().catch(console.error);
