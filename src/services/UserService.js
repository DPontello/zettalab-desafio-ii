const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../errors/AppError");

class UserService {
  async create({ name, email, password }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already in use.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    return user;
  }
}

module.exports = new UserService();
