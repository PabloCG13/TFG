const Web3 = require("web3");
const contractJson = require("./build/contracts/Prueba2.json");

const web3 = new Web3("http://127.0.0.1:7545"); // Dirección de Ganache

const contractAddress = "DIRECCIÓN_DEL_CONTRATO"; // Reemplaza con la dirección después del despliegue
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function main() {
    const accounts = await web3.eth.getAccounts();
    console.log("Cuentas disponibles en Ganache:", accounts);

    // Llamada de prueba para agregar una universidad
    await contract.methods.addUniversity("hashUniversidad", accounts[1]).send({ from: accounts[0] });
    console.log("Universidad agregada!");

    // Consultar la universidad
    const universidad = await contract.methods.universityToHash(accounts[1]).call();
    console.log("Universidad registrada:", universidad);
}

main().catch(console.error);
