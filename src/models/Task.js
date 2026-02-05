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
    this.belongsToMany(models.Tag, {
      through: 'task_tags',
      foreignKey: 'task_id',
      as: 'tags',
    });
    this.hasMany(models.Subtask, {
      foreignKey: 'task_id',
      as: 'subtasks',
    });
  }
}

module.exports = Task;
