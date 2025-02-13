const pgp = require("pg-promise")();
const db = pgp({
    host: "db",
    user: "postgres",
    password: "postgres",
    database: "postgres",
    port: 5432
});

module.exports = db;