const SubtaskService = require('../services/SubtaskService');

class SubtaskController {
  async store(req, res) {
    try {
      const { taskId } = req.params;
      const subtask = await SubtaskService.create(taskId, req.body);
      return res.status(201).json(subtask);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(req, res) {
    try {
      const { taskId } = req.params;
      const subtasks = await SubtaskService.list(taskId);
      return res.json(subtasks);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const subtask = await SubtaskService.show(id);
      return res.json(subtask);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const subtask = await SubtaskService.update(id, req.body);
      return res.json(subtask);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await SubtaskService.delete(id);
      return res.status(204).send();
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async toggleComplete(req, res) {
    try {
      const { id } = req.params;
      const subtask = await SubtaskService.toggleComplete(id);
      return res.json(subtask);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new SubtaskController();
