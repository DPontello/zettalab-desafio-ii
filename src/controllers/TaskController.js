const Task = require("../models/Task");
const taskValidator = require("../validators/TaskValidator");

const normalizeStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : status;

class TaskController {
  async index(req, res) {
    const status = normalizeStatus(req.query.status);
    const where = { userId: req.userId };

    if (status) {
      if (!taskValidator.allowedStatus.includes(status)) {
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
    const payload = {
      ...req.body,
      status: normalizeStatus(req.body.status) || "PENDING"
    };

    try {
      await taskValidator.schema.validate(payload, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation fails.", details: err.errors });
    }

    const task = await Task.create({
      title: payload.title,
      description: payload.description,
      status: payload.status,
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

    const payload = {
      ...req.body
    };

    if (payload.status !== undefined) {
      payload.status = normalizeStatus(payload.status);
    }

    try {
      await taskValidator.updateSchema.validate(payload, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation fails.", details: err.errors });
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
