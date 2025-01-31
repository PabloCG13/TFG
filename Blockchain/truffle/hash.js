const crypto = require('crypto');
/*
async function generateSHA256Hash(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  
  // Uso de la función
  generateSHA256Hash("Hola, mundo!").then(hash => console.log(hash));
*/
  async function generateSHA256HashMessage(user, passwd) {
    const combinedString = user + passwd; // Concatenación de las cadenas
    const encoder = new TextEncoder();
    const data = encoder.encode(combinedString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Uso de la función
  generateSHA256HashMessage("ucm", "holaMundo123").then(hash => console.log(hash));

/*function generateSHA256Hash(message) {
  return crypto.createHash('sha256').update(message).digest('hex');
}
*/
// Uso de la función
//console.log(generateSHA256Hash("Hola, mundo!"));


