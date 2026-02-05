const sessionSchema = require("../validators/SessionValidator");
const sessionService = require("../services/SessionService");
const AppError = require("../errors/AppError");

class SessionController {
  async store(req, res) {
    try {
      await sessionSchema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation fails.", details: err.errors });
    }

    try {
      const { user, token } = await sessionService.authenticate(req.body);

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
  }
}

module.exports = new SessionController();
