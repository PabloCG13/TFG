const { exec } = require("child_process");

// Lista de scripts a ejecutar
const scripts = [
  "addUniversity.js",
  "addParticipant.js",
  "addCourseCoord.js",
  "consultUniversity.js",
  "createERC721.js",
  "addTeacherToTranscript.js",
  "addTranscriptHash.js"
];

function runScript(script, callback) {
  console.log(`Ejecutando ${script}...`);
  exec(`node ./${script}`, (error, stdout, stderr) => {
    if (error) {
      console.error(` Error ejecutando ${script}:`, error);
      return;
    }
    if (stderr) {
      console.error(` Advertencia en ${script}:`, stderr);
    }
    console.log(`${script} ejecutado correctamente.\n`);
    callback();
  });
}

// Función recursiva para ejecutar los scripts en orden
function runScriptsSequentially(index = 0) {
  if (index < scripts.length) {
    runScript(scripts[index], () => runScriptsSequentially(index + 1));
  } else {
    console.log("Todos los scripts han sido ejecutados.");
  }
}

// Ejecutar scripts en orden
runScriptsSequentially();
