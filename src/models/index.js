const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const User = require("./User");
const Task = require("./Task");

const connection = new Sequelize(dbConfig);

User.init(connection);
Task.init(connection);

User.associate(connection.models);
Task.associate(connection.models);

module.exports = connection;
