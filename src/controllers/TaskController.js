const taskValidator = require("../validators/TaskValidator");
const taskService = require("../services/TaskService");
const AppError = require("../errors/AppError");

const normalizeStatus = (status) =>
  typeof status === "string" ? status.toUpperCase() : status;

class TaskController {
  async index(req, res) {
    const status = normalizeStatus(req.query.status);
    try {
      const tasks = await taskService.list({ userId: req.userId, status });
      return res.json(tasks);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
  }

  async show(req, res) {
    try {
      const task = await taskService.findById({
        userId: req.userId,
        taskId: req.params.id
      });
      return res.json(task);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
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

    const task = await taskService.create({ userId: req.userId, payload });

    return res.status(201).json(task);
  }

  async update(req, res) {
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

    try {
      const task = await taskService.update({
        userId: req.userId,
        taskId: req.params.id,
        payload
      });
      return res.json(task);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
  }

  async delete(req, res) {
    try {
      await taskService.remove({ userId: req.userId, taskId: req.params.id });
      return res.status(204).send();
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
  }
}

module.exports = new TaskController();
