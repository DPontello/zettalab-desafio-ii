const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/auth");
const AppError = require("../errors/AppError");

class SessionService {
  async authenticate({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials.", 401);
    }

    const passwordMatches = await user.checkPassword(password);
    if (!passwordMatches) {
      throw new AppError("Invalid credentials.", 401);
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn
    });

    return { user, token };
  }
}

module.exports = new SessionService();
