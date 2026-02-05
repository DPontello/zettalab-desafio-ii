const Task = require("../models/Task");

const ALLOWED_STATUS = ["PENDING", "COMPLETED"];

const normalizeStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : status;

class TaskController {
  async index(req, res) {
    const status = normalizeStatus(req.query.status);
    const where = { userId: req.userId };

    if (status) {
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ error: "Invalid status filter." });
      }
      where.status = status;
    }

    const tasks = await Task.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });

    return res.json(tasks);
  }

  async show(req, res) {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.json(task);
  }

  async store(req, res) {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const normalizedStatus = normalizeStatus(status) || "PENDING";
    if (!ALLOWED_STATUS.includes(normalizedStatus)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const task = await Task.create({
      title,
      description,
      status: normalizedStatus,
      userId: req.userId
    });

    return res.status(201).json(task);
  }

  async update(req, res) {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    const { title, description, status } = req.body;
    const payload = {};

    if (title !== undefined) {
      payload.title = title;
    }

    if (description !== undefined) {
      payload.description = description;
    }

    if (status !== undefined) {
      const normalizedStatus = normalizeStatus(status);
      if (!ALLOWED_STATUS.includes(normalizedStatus)) {
        return res.status(400).json({ error: "Invalid status." });
      }
      payload.status = normalizedStatus;
    }

    await task.update(payload);

    return res.json(task);
  }

  async delete(req, res) {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    await task.destroy();

    return res.status(204).send();
  }
}

module.exports = new TaskController();
