require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json());

//routes
app.use(require("./routes/index.js"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => console.log("Server listening on port: ", port));
