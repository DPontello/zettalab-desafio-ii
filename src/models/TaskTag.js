const { DataTypes } = require('sequelize');

class TaskTag {
  static init(sequelize) {
    this.model = sequelize.define(
      'TaskTag',
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
        tag_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'tags',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        tableName: 'task_tags',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['task_id', 'tag_id'],
          },
        ],
      }
    );

    return this.model;
  }
}

module.exports = TaskTag;
