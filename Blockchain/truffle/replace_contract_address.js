const fs = require("fs");
const path = require("path");

// Configura aquí la nueva dirección del contrato
const NEW_CONTRACT_ADDRESS = "0xNEW_CONTRACT_ADDRESS_HERE";  // 🔹 CAMBIA ESTA DIRECCIÓN

// Expresión regular para encontrar la línea de `contractAddress`
const regex = /const contractAddress = "0x[a-fA-F0-9]{40}";/;

// Ruta de los archivos a modificar (puedes poner más archivos aquí)
const files = [
    "addUniversity.js",
    "addParticipant.js",
    "addCourseCoord.js",
    "consultUniversity.js",
    "createERC721.js",
    "addTeacherToTranscript.js",
    "addTranscriptHash.js",
    "addValidation"
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
