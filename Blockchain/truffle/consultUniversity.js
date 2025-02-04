const crypto = require("crypto");
const contractJson = require("./build/contracts/tfg.json");
const { Web3 } = require("web3");

const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = "0xab804BAE97dD30Cf81d473aD16d1D219BA8C11d0";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function main() {
    const accounts = await web3.eth.getAccounts();
    const universityAddress = "0x6562de21fA088731Aac85799e418Cb54F797Df35";
    const studentAddress = "0xdeEDCf74bD222e4AdED22d05056Ce99587Faa597";

    0xb9c39a42e45380720ab6f615189f5cb78c9282db6cca391123d7ff49882c46f3
    0xb9c39a42e45380720ab6f615189f5cb78c9282db6cca391123d7ff49882c46f3
    console.log("Cuenta usada para la transacción:", universityAddress);

    try {
        // Ejecutar `consultUniversity` y obtener el valor booleano
        //b9c39a42e45380720ab6f615189f5cb78c9282db6cca391123d7ff49882c46f3

        const aux = await contract.methods.calculateSHA256("ucm", "holaMundo123").call({ from: universityAddress });
        console.log("Hash que genera el contrato: ", aux);

        const aux2 = await contract.methods.test().call({ from: universityAddress });
        console.log("Hash que esta guardado en el contrato: ", aux2);

        const result = await contract.methods.consultUniversity("ucm", "holaMundo123").call({ from: universityAddress });

        console.log("Resultado de consultUniversity:", result ? "True" : "False");

        const result2 = await contract.methods.consultParticipant("alumno_1", "1234567hola").call({ from: studentAddress });

        console.log("Resultado de consultParticipant:", result2 ? "True" : "False");
    } catch (error) {
        console.error("Error en la consulta:", error);
    }
}

main().catch(console.error);
