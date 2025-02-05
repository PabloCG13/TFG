const fs = require("fs");
const crypto = require("crypto");
const { Web3 } = require("web3");

// Configuración de Web3 y el contrato
const web3 = new Web3("http://127.0.0.1:7545");
const contractJson = require("./build/contracts/tfg.json");


const contractAddress = "0xa32C254378997e56767f088661628bf07A7c2F7f";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

// Dirección del coordinador
const coordAddress = "0xb8b6F379B72c5a0ff295ba3A702FAA2cA5Ed7957";

// Direccion del alumno
const studentAddress = "0xdeEDCf74bD222e4AdED22d05056Ce99587Faa597";

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
        console.log("🔹 Hash SHA-256 generado:", hash);


        // Enviar la transacción a `updateMark`
        const tx = await contract.methods.updateMark(hash, studentAddress).send({
            from: coordAddress,
            gas: 6721975
        });

        console.log("Transacción exitosa:", tx.transactionHash);
    } catch (error) {
        console.error("Error:", error);
    }
}

// 🚀 Ejecutar la función principal
main();
