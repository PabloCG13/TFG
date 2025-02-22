

const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";

const contract = new web3.eth.Contract(contractJson.abi, contractAddress);


async function main() {
    const accounts = await web3.eth.getAccounts();
    
    const universityAddress = "0x44e7A1a2a828d234B01c4664a26930c477bf2b72";
    const teacherAddress = "0x7664f122DC9D62355d01585166111800466273cF";
    const studentAddress = "0x21AA8bac29c1b22a447BfB2d418C9A5B5cBaf282";


    try {
       
        const tx = await contract.methods.addTeacherToTranscript(studentAddress, teacherAddress).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

    
    const storedHash = await contract.methods.getAllowedTeachers(studentAddress).call();
    console.log("Allowed teachers to modify transcript for student2:", storedHash);
}

main().catch(console.error);
