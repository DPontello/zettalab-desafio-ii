const Task = require("../models/Task");
const AppError = require("../errors/AppError");
const { allowedStatus } = require("../validators/TaskValidator");

class TaskService {
  async list({ userId, status }) {
    const where = { userId };

    if (status) {
      if (!allowedStatus.includes(status)) {
        throw new AppError("Invalid status filter.");
      }
      where.status = status;
    }

    return Task.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: 'tags',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
        {
          association: 'subtasks',
          attributes: ['id', 'title', 'completed', 'position'],
        },
      ],
    });
  }

  async findById({ userId, taskId }) {
    const task = await Task.findOne({
      where: { id: taskId, userId },
      include: [
        {
          association: 'tags',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
        {
          association: 'subtasks',
          attributes: ['id', 'title', 'completed', 'position'],
          order: [['position', 'ASC']],
        },
      ],
    });
    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    return task;
  }

  async create({ userId, payload }) {
    return Task.create({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      userId
    });
  }

  async update({ userId, taskId, payload }) {
    const task = await this.findById({ userId, taskId });
    await task.update(payload);
    return task;
  }

  async remove({ userId, taskId }) {
    const task = await this.findById({ userId, taskId });
    await task.destroy();
  }
}

module.exports = new TaskService();
