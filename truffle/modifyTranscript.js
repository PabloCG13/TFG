const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");
const fs = require("fs");


// Set up Web3 connection
const web3 = new Web3("http://ganache:8545"); // Change if necessary
const contractAddress = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function generateSHA256HashMessage(jsonData) {
   let jsonString;
   if (Array.isArray(jsonData)) 
   	jsonString = jsonData.map(obj=>JSON.stringify(obj, Object.keys(obj).sort())).join("");
   else 
   	jsonString = JSON.stringify(jsonData, Object.keys(jsonData).sort());
   const hash = crypto.createHash("sha256").update(jsonString).digest("hex");
   return "0x" + hash;
}


async function modifyTranscript(file, addressStudent, address, type) {
   const studentAddress = addressStudent;
   const modifierAddress = address;
   console.log("student address:",studentAddress, "modifier address:", modifierAddress);
   const allowedTeachers = await contract.methods.getAllowedTeachers(studentAddress).call();
   console.log("allowed teachers:",allowedTeachers);

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

   if (type === 1) {
      try {
	       const hash = await generateSHA256HashMessage(jsonData);
	       console.log("Transcript HASH:", hash);


	       const tx = await contract.methods.updateMark(hash, studentAddress).send({
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
   else {
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

}


module.exports = { modifyTranscript };





