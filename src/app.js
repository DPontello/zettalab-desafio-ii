const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
