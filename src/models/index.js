const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const User = require("./User");
const Task = require("./Task");
const Tag = require("./Tag");
const TaskTag = require("./TaskTag");
const Subtask = require("./Subtask");

const connection = new Sequelize(dbConfig);

User.init(connection);
Task.init(connection);
Tag.init(connection);
TaskTag.init(connection);
Subtask.init(connection);

User.associate(connection.models);
Task.associate(connection.models);
Tag.associate(connection.models);
Subtask.associate(connection.models);

module.exports = connection;
