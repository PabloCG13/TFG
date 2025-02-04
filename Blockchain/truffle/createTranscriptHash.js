const fs = require("fs");
const crypto = require("crypto");

// Función para generar SHA-256
async function generateSHA256HashMessage(jsonData) {
    // Convertir el JSON a string ordenado (para mantener la consistencia en el hashing)
    const jsonString = JSON.stringify(jsonData, Object.keys(jsonData).sort());
    
    // Generar el hash SHA-256
    return crypto.createHash("sha256").update(jsonString).digest("hex");
}

// Leer el archivo `person.json`
fs.readFile("person.json", "utf8", async (err, data) => {
    if (err) {
        console.error("Error leyendo el archivo:", err);
        return;
    }

    try {
        const jsonData = JSON.parse(data); // Convertir JSON a objeto
        const hash = await generateSHA256HashMessage(jsonData);
        
        console.log("Hash SHA-256 generado:", hash);
    } catch (error) {
        console.error("Error procesando JSON:", error);
    }
});
