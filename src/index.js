require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());

app.use(cors());

//routes
app.use(require("./routes/user.routes"));
app.use(require("./routes/tag.routes"));
app.use(require("./routes/image.routes"));
app.use(require("./routes/gallery.routes"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log("Server listening on port: ", port));
