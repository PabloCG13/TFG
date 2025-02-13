const fs = require("fs");
const path = require("path");

// Configura aquí la nueva dirección del contrato
const NEW_CONTRACT_ADDRESS = "0x26Ba181AB99374e1b23d02B328961c1665Bd8666";  //  CHANGE THIS ADDRESS

// Expresión regular para encontrar la línea de `contractAddress`
const regex = /const contractAddress = "0x[a-fA-F0-9]{40}";/;


const files = [
    "addUniversity.js",
    "addParticipant.js",
    "addCourseCoord.js",
    "consultUniversity.js",
    "createERC721.js",
    "addTeacherToTranscript.js",
    "modifyTranscriptHash.js",
    "addValidation.js",
    "createTranscript.js",
    "transferValidation.js"
];

// Función para reemplazar la dirección en cada archivo
function replaceContractAddress(filePath) {
    const absolutePath = path.join(__dirname, filePath);

    // Leer el archivo
    fs.readFile(absolutePath, "utf8", (err, data) => {
        if (err) {
            console.error(` Error leyendo ${filePath}:`, err);
            return;
        }

        // Verificar si el archivo contiene la línea a modificar
        if (!regex.test(data)) {
            console.log(` No se encontró contractAddress en ${filePath}, omitiendo...`);
            return;
        }

        // Reemplazar la línea con la nueva dirección
        const updatedData = data.replace(regex, `const contractAddress = "${NEW_CONTRACT_ADDRESS}";`);

        // Guardar los cambios en el archivo
        fs.writeFile(absolutePath, updatedData, "utf8", (err) => {
            if (err) {
                console.error(` Error escribiendo en ${filePath}:`, err);
                return;
            }
            console.log(` Dirección del contrato actualizada en ${filePath}`);
        });
    });
}

// Ejecutar el reemplazo en todos los archivos
files.forEach(replaceContractAddress);
