

const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");

//const Web3 = require("web3");
const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

//const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
//const web3 = new Web3(provider);

const contractAddress = "0xaf5C4C6C7920B4883bC6252e9d9B8fE27187Cf68";


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
    const newTeacherName = "teacher_2";
    const newTeacherPass = "pasfkpsvgna";
    const teacherName2 = "teacher_3";
    const teacherPass2 = "slafhkahg";
    const coordName2 = "teacher_4";
    const coordPass2 = "kpaSASDOHNIDYB";
    const teacherRole = 3;
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const universityAddress2 = "0x44e7A1a2a828d234B01c4664a26930c477bf2b72";
    const teacherAddress = "0xb8b6F379B72c5a0ff295ba3A702FAA2cA5Ed7957";
    const newTeacherAddress = "0x9260D2095df51397485F3ed5a9dCb22Beb05cA84";
    const teacherAddress2 = "0x7664f122DC9D62355d01585166111800466273cF";
    const coordAddress2 = "0x3cEA50991c020f328f9a5892516383C11BC8A2B8";

    // Generar hash SHA-256
    const teacherHash = await generateSHA256HashMessage(teacherName, teacherPass);
    console.log("First Coordinator in Uni1 HASH:", teacherHash);

    const newTeacherHash = await generateSHA256HashMessage(newTeacherName, newTeacherPass);
    console.log("Second Coordinator in Uni1 HASH:", newTeacherHash);

    const teacherHash2 = await generateSHA256HashMessage(teacherName2, teacherPass2);
    console.log("Teacher in Uni2 HASH:", teacherHash2);

    const coordHash2 = await generateSHA256HashMessage(coordName2, coordPass2);
    console.log("Coordinator in Uni2 HASH:", coordHash2);

    try {
       
        const tx = await contract.methods.addParticipant(teacherHash, teacherAddress, teacherRole).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction for First Coordinator in Uni1:", tx.transactionHash);

        const tx2 = await contract.methods.addParticipant(newTeacherHash, newTeacherAddress, teacherRole).send({ 
            from: universityAddress, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction for Second Coordinator in Uni1:", tx2.transactionHash);

        const tx3 = await contract.methods.addParticipant(teacherHash2, teacherAddress2, 2).send({ 
            from: universityAddress2, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction for teacher in Uni2:", tx3.transactionHash);

        const tx4 = await contract.methods.addParticipant(coordHash2, coordAddress2, teacherRole).send({ 
            from: universityAddress2, 
            gas: 6721975  // Aumentar el límite de gas 
        });
        console.log("Succesful transaction for Coordinator in Uni2:", tx4.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }

    
    const storedHash = await contract.methods.personToHash(teacherAddress).call();
    console.log("First Coordinator in Uni1 HASH:", storedHash);
    const newStoredHash = await contract.methods.personToHash(newTeacherAddress).call();
    console.log("Second Coordinator in Uni1 HASH:", newStoredHash);

    const storedHash2 = await contract.methods.personToHash(teacherAddress2).call();
    console.log("Teacher in Uni2 HASH:", storedHash2);
    const storedHash4 = await contract.methods.personToHash(coordAddress2).call();
    console.log("Coordinator in Uni2 HASH:", storedHash4);
}

main().catch(console.error);
