const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd;
    const hash = crypto.createHash("sha256").update(combinedString).digest("hex");
    return "0x" + hash;
}


async function findFirstUnusedAccount() {
    const accounts = await web3.eth.getAccounts();

    for (const account of accounts) {
        const transactionCount = await web3.eth.getTransactionCount(account);

        if (transactionCount === 0) {
            console.log(`First unused account found: ${account}`);
            return account;
        }
    }

    console.log("No unused accounts found.");
    return null;
}

async function modifyTranscript(file, addressStudent, address, type) {
    const studentAddress = addressStudent;
    const modifierAddress =  address;// await findFirstUnusedAccount();

    if(type == 1){
        try {
            // Leer el archivo JSON de manera asíncrona
            const data = await fs.promises.readFile(file, "utf8");
            const jsonData = JSON.parse(data);
    
            // Generar el hash SHA-256
            const hash = await generateSHA256HashMessage(jsonData);
            //console.log("Transcript HASH:", hash);
    
            // Enviar la transacción a `updateMark`
            const tx = await contract.methods.updateMark(hash, studentAddress).send({
                from: address,
                gas: 6721975
            });
    
            console.log("Succesful transaction:", tx.transactionHash);
            return hash;
        } catch (error) {
            console.error("Error:", error);
        }
    }else{
        try {
            // Leer el archivo JSON de manera asíncrona
            const data = await fs.promises.readFile(file, "utf8");
            const jsonData = JSON.parse(data);
    
            // Generar el hash SHA-256
            const hash = await generateSHA256HashMessage(jsonData);
            //console.log("Transcript HASH:", hash);
    
            // Enviar la transacción a `updateMark`
            const tx = await contract.methods.updateTranscript(hash, studentAddress).send({
                from: address,
                gas: 6721975
            });
    
            console.log("Succesful transaction:", tx.transactionHash);
            return hash;
        } catch (error) {
            console.error("Error:", error);
        }
    }
      
}

// Export the function to be used in another file
module.exports = { modifyTranscript };