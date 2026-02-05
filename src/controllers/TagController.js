const TagService = require('../services/TagService');

class TagController {
  async store(req, res) {
    try {
      const tag = await TagService.create(req.body);
      return res.status(201).json(tag);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(req, res) {
    try {
      const tags = await TagService.list();
      return res.json(tags);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const tag = await TagService.show(id);
      return res.json(tag);
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
      const tag = await TagService.update(id, req.body);
      return res.json(tag);
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
      await TagService.delete(id);
      return res.status(204).send();
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async attachToTask(req, res) {
    try {
      const { taskId, tagId } = req.params;
      const result = await TagService.attachToTask(taskId, tagId);
      return res.json(result);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async detachFromTask(req, res) {
    try {
      const { taskId, tagId } = req.params;
      const result = await TagService.detachFromTask(taskId, tagId);
      return res.json(result);
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new TagController();
