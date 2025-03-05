const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");
const fs = require("fs");


// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(jsonData) {
   const jsonString = JSON.stringify(jsonData, Object.keys(jsonData).sort());
   const hash = crypto.createHash("sha256").update(jsonString).digest("hex");
   return "0x" + hash;
}


async function modifyTranscript(file, addressStudent, address, type) {
   const studentAddress = addressStudent;
   const modifierAddress = address;


   let jsonData;
   if (typeof file === "string") {
       const data = await fs.promises.readFile(file, "utf8");
       jsonData = JSON.parse(data);
   } else if (typeof file === "object") {
       jsonData = file;
   } else {
       throw new Error("Invalid file format: expected a JSON object or file path.");
   }


   try {
       const hash = await generateSHA256HashMessage(jsonData);
       console.log("Transcript HASH:", hash);


       const tx = await contract.methods.updateTranscript(hash, studentAddress).send({
           from: modifierAddress,
           gas: 6721975
       });


       console.log("Successful transaction:", tx.transactionHash);
       const storedHash = await contract.methods.getTranscriptHash(studentAddress).call();
       return storedHash;
   } catch (error) {
       console.error("Error:", error);
   }
}


module.exports = { modifyTranscript };





