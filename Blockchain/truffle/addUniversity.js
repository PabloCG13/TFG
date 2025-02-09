const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

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

    
    const universityName1 = "ucm";
    const universityPass1 = "holaMundo123";
    const universityAddress1 = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const universityName2 = "bkl";
    const universityPass2 = "HelloWorld";
    const universityAddress2 = "0x44e7A1a2a828d234B01c4664a26930c477bf2b72";

    // Generar hash SHA-256
    const universityHash1 = await generateSHA256HashMessage(universityName1, universityPass1);
    console.log("First University HASH:", universityHash1);

    const universityHash2 = await generateSHA256HashMessage(universityName2, universityPass2);
    console.log("Second University HASH:", universityHash2);

    try {
       
        const tx1 = await contract.methods.addUniversity(universityHash1, universityAddress1).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx1.transactionHash);

        const tx2 = await contract.methods.addUniversity(universityHash2, universityAddress2).send({ 
            from: owner, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx2.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

    
    const storedHash1 = await contract.methods.universityToHash(universityAddress1).call();
    console.log("First University HASH:", storedHash1);
    const storedHash2 = await contract.methods.universityToHash(universityAddress2).call();
    console.log("Second University HASH:", storedHash2);
}

main().catch(console.error);
