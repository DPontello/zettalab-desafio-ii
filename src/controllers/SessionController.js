const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/auth");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordMatches = await user.checkPassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  }
}

module.exports = new SessionController();
