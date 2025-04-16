const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");
const fs = require("fs");

// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(jsonData) {
   let jsonString;
   if (Array.isArray(jsonData)) 
   	jsonString = jsonData.map(obj=>JSON.stringify(obj, Object.keys(obj).sort())).join("");
   else 
   	jsonString = JSON.stringify(jsonData, Object.keys(jsonData).sort());
   
    console.log("String",jsonString);
    const hash = crypto.createHash("sha256").update(jsonString).digest("hex");
   return "0x" + hash;
}


async function askForTranscript(file, addressStudent) {
   const studentAddress = addressStudent;
   console.log("student address:",studentAddress);


   let jsonData;
   if (typeof file === "string") {
       const data = await fs.promises.readFile(file, "utf8");
       jsonData = JSON.parse(data);
   } else if (typeof file === "object") {
       jsonData = file;
       console.log("JSONDATA",jsonData);
   } else {
       throw new Error("Invalid file format: expected a JSON object or file path.");
   }

  
    try {
        const hash = await generateSHA256HashMessage(jsonData);
        console.log("Transcript HASH:", hash);

        const result = await contract.methods.isTranscriptHashEqual(hash).call({
            from: studentAddress
        });

        console.log("Result:", result);
        const storedHash = await contract.methods.getTranscriptHash(studentAddress).call();
   	    console.log("Stored hash", storedHash)  
        return {result, storedHash};
    } catch (error) {
        console.error("Error:", error);
    }
   

}


module.exports = { askForTranscript };





