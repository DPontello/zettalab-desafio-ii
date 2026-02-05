const { Tag, Task } = require('../models/index').models;
const AppError = require('../errors/AppError');

class TagService {
  async create({ name, color }) {
    const tagExists = await Tag.findOne({ where: { name } });

    if (tagExists) {
      throw new AppError('Tag com este nome já existe', 400);
    }

    const tag = await Tag.create({ name, color });
    return tag;
  }

  async list() {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          association: 'tasks',
          attributes: ['id', 'title'],
          through: { attributes: [] },
        },
      ],
    });
    return tags;
  }

  async show(id) {
    const tag = await Tag.findByPk(id, {
      include: [
        {
          association: 'tasks',
          through: { attributes: [] },
        },
      ],
    });

    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    return tag;
  }

  async update(id, { name, color }) {
    const tag = await Tag.findByPk(id);

    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    if (name && name !== tag.name) {
      const tagExists = await Tag.findOne({ where: { name } });
      if (tagExists) {
        throw new AppError('Já existe uma tag com este nome', 400);
      }
    }

    await tag.update({ name, color });
    return tag;
  }

  async delete(id) {
    const tag = await Tag.findByPk(id);

    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    await tag.destroy();
  }

  async attachToTask(taskId, tagId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    await task.addTag(tag);
    return { message: 'Tag associada à tarefa com sucesso' };
  }

  async detachFromTask(taskId, tagId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      throw new AppError('Tag não encontrada', 404);
    }

    await task.removeTag(tag);
    return { message: 'Tag desassociada da tarefa com sucesso' };
  }
}

module.exports = new TagService();
