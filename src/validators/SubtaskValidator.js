const yup = require('yup');

class SubtaskValidator {
  async store(req, res, next) {
    try {
      const schema = yup.object().shape({
        title: yup.string().required('Título é obrigatório').min(3, 'Título deve ter no mínimo 3 caracteres'),
        completed: yup.boolean(),
        position: yup.number().integer(),
      });

      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validation failed',
        messages: err.errors,
      });
    }
  }

  async update(req, res, next) {
    try {
      const schema = yup.object().shape({
        title: yup.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
        completed: yup.boolean(),
        position: yup.number().integer(),
      });

      await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validation failed',
        messages: err.errors,
      });
    }
  }
}

module.exports = new SubtaskValidator();
