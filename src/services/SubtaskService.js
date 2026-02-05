const { Subtask, Task } = require('../models/index').models;
const AppError = require('../errors/AppError');

class SubtaskService {
  async create(taskId, { title, completed = false, position = 0 }) {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    const subtask = await Subtask.create({
      task_id: taskId,
      title,
      completed,
      position,
    });

    return subtask;
  }

  async list(taskId) {
    const task = await Task.findByPk(taskId);

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    const subtasks = await Subtask.findAll({
      where: { task_id: taskId },
      order: [['position', 'ASC'], ['created_at', 'ASC']],
    });

    return subtasks;
  }

  async show(id) {
    const subtask = await Subtask.findByPk(id, {
      include: [
        {
          association: 'task',
          attributes: ['id', 'title'],
        },
      ],
    });

    if (!subtask) {
      throw new AppError('Subtarefa não encontrada', 404);
    }

    return subtask;
  }

  async update(id, { title, completed, position }) {
    const subtask = await Subtask.findByPk(id);

    if (!subtask) {
      throw new AppError('Subtarefa não encontrada', 404);
    }

    await subtask.update({ title, completed, position });
    return subtask;
  }

  async delete(id) {
    const subtask = await Subtask.findByPk(id);

    if (!subtask) {
      throw new AppError('Subtarefa não encontrada', 404);
    }

    await subtask.destroy();
  }

  async toggleComplete(id) {
    const subtask = await Subtask.findByPk(id);

    if (!subtask) {
      throw new AppError('Subtarefa não encontrada', 404);
    }

    await subtask.update({ completed: !subtask.completed });
    return subtask;
  }
}

module.exports = new SubtaskService();
