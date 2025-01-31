

const {Web3} = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

async function createNewAccount() {
    const newAccount = await web3.eth.personal.newAccount("0x52e75d17b9e69a055a2c89d6ee21249e94a5f89c6e9aca325c57550305e723f5");
    console.log("Nueva cuenta creada:", newAccount);
}

createNewAccount().catch(console.error);
