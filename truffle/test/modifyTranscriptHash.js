const fs = require("fs");
const crypto = require("crypto");
const { Web3 } = require("web3");

// Configuración de Web3 y el contrato
const web3 = new Web3("http://127.0.0.1:7545");
const contractJson = require("./build/contracts/tfg.json");


const contractAddress = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

// Dirección del coordinador
const coordAddress = "0x3cEA50991c020f328f9a5892516383C11BC8A2B8";

// Direccion del alumno
const studentAddress = "0x21AA8bac29c1b22a447BfB2d418C9A5B5cBaf282";

// Función para generar SHA-256
async function generateSHA256HashMessage(jsonData) {
    const jsonString = JSON.stringify(jsonData, Object.keys(jsonData).sort());
    return crypto.createHash("sha256").update(jsonString).digest("hex");
}

// Función principal
async function main() {
    try {
        // Leer el archivo JSON de manera asíncrona
        const data = await fs.promises.readFile("person.json", "utf8");
        const jsonData = JSON.parse(data);

        // Generar el hash SHA-256
        const hash = await generateSHA256HashMessage(jsonData);
        console.log("Transcript HASH:", hash);



        // Enviar la transacción a `updateMark`
        const tx = await contract.methods.updateMark(hash, studentAddress).send({
            from: coordAddress,
            gas: 6721975
        });

        console.log("Succesful transaction:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }
}

// 🚀 Ejecutar la función principal
main();
