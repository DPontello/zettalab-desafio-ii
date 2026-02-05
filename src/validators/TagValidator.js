const yup = require('yup');

class TagValidator {
  async store(req, res, next) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter no mínimo 2 caracteres'),
        color: yup.string().matches(/^#[0-9A-Fa-f]{6}$/i, 'Cor deve estar no formato #RRGGBB'),
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
        name: yup.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
        color: yup.string().matches(/^#[0-9A-Fa-f]{6}$/i, 'Cor deve estar no formato #RRGGBB'),
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

module.exports = new TagValidator();
