const fs = require("fs");
const path = require("path");

const NEW_CONTRACT_ADDRESS = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";  //  CHANGE THIS ADDRESS

const regex = /const contractAddress = "0x[a-fA-F0-9]{40}";/;

const files = [
    "test/addUniversity.js",
    "test/addParticipant.js",
    "test/addCourseCoord.js",
    "test/consultUniversity.js",
    "test/createERC721.js",
    "test/addTeacherToTranscript.js",
    "test/modifyTranscriptHash.js",
    "test/addValidation.js",
    "test/createTranscript.js",
    "test/transferValidation.js",
    "addUniversity.js",
    "addParticipant.js",
    "changeParticipant.js",
    "consult.js", 
    "askForTranscript.js",
    "addTeacherToTranscript.js",
    "modifyTranscript.js",
    "addValidation.js",
    "updateValidation.js",
    "transferValidation.js",
    "getTeachersAllowed.js",
    "revokeTeacherFromTranscript.js",
    "blockchain_api.js"
];

// Method to replace contractAddress in the filePath
function replaceContractAddress(filePath) {
    const absolutePath = path.join(__dirname, filePath);

    fs.readFile(absolutePath, "utf8", (err, data) => {
        if (err) {
            console.error(` Error leyendo ${filePath}:`, err);
            return;
        }

        if (!regex.test(data)) {
            console.log(` No se encontró contractAddress en ${filePath}, omitiendo...`);
            return;
        }

        const updatedData = data.replace(regex, `const contractAddress = "${NEW_CONTRACT_ADDRESS}";`);
        
        fs.writeFile(absolutePath, updatedData, "utf8", (err) => {
            if (err) {
                console.error(` Error escribiendo en ${filePath}:`, err);
                return;
            }
            console.log(` Dirección del contrato actualizada en ${filePath}`);
        });
    });
}

// Do it for evey file
files.forEach(replaceContractAddress);
