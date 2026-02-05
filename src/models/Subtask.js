const { DataTypes } = require('sequelize');

class Subtask {
  static init(sequelize) {
    this.model = sequelize.define(
      'Subtask',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        task_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'tasks',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        completed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: 'subtasks',
        timestamps: true,
        underscored: true,
      }
    );

    return this.model;
  }

  static associate(models) {
    this.model.belongsTo(models.Task, {
      foreignKey: 'task_id',
      as: 'task',
    });
  }
}

module.exports = Subtask;
