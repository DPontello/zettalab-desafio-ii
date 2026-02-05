const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        passwordHash: {
          type: DataTypes.STRING,
          field: "password_hash"
        }
      },
      {
        sequelize,
        tableName: "users",
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Task, { foreignKey: "userId", as: "tasks" });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

module.exports = User;
