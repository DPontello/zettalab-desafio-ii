const path = require("path");
require("dotenv").config();

const storage =
  process.env.DB_STORAGE ||
  path.resolve(__dirname, "..", "..", "database.sqlite");

module.exports = {
  dialect: "sqlite",
  storage,
  logging: false
};
