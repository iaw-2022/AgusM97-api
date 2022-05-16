require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 9000;

// middlewares
//app.use(express.json());

//routes
app.use(require("./routes/index.js"));

app.listen(port, () => console.log("Server listening on port: ", port));
