const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        status: {
          type: DataTypes.STRING,
          defaultValue: "PENDING",
          validate: {
            isIn: [["PENDING", "COMPLETED"]]
          }
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "user_id"
        }
      },
      {
        sequelize,
        tableName: "tasks",
        underscored: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

module.exports = Task;
