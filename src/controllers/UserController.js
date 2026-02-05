const userSchema = require("../validators/UserValidator");
const userService = require("../services/UserService");
const AppError = require("../errors/AppError");

class UserController {
  async store(req, res) {
    try {
      await userSchema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation fails.", details: err.errors });
    }

    try {
      const user = await userService.create(req.body);
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }

      throw err;
    }
  }
}

module.exports = new UserController();
