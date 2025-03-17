const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

const db = require("./config/db");


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "API connected and working" });
});

require("./routes/universities.routes")(app);
require("./routes/teachers.routes")(app);
require("./routes/degrees.routes")(app);
require("./routes/students.routes")(app);
require("./routes/courses.routes")(app);
require("./routes/validations.routes")(app);
require("./routes/transcripts.routes")(app);
require("./routes/studies.routes")(app);
require("./routes/addresses.routes")(app);
require("./routes/validates.routes")(app);

// set port, listen for requests
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
