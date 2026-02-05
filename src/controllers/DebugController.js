const connection = require("../models");
const UserService = require("../services/UserService");

class DebugController {
  async data(req, res) {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ error: "Debug endpoints are disabled." });
    }

    const { User, Task, Subtask } = connection.models;

    const users = await User.findAll({
      attributes: ["id", "name", "email"],
      order: [["id", "ASC"]]
    });

    const tasks = await Task.findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: Subtask,
          as: "subtasks",
          attributes: ["id", "title", "completed", "position", "task_id"],
          separate: true,
          order: [["position", "ASC"], ["id", "ASC"]]
        }
      ]
    });

    return res.json({ users, tasks });
  }

  async reset(req, res) {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ error: "Debug endpoints are disabled." });
    }

    await connection.sync({ force: true });
    const defaultUser = await UserService.create({
      name: "Admin",
      email: "admin@local.test",
      password: "123456"
    });

    return res.json({
      message: "Database reset done. Default user created.",
      user: {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email
      }
    });
  }
}

module.exports = new DebugController();
