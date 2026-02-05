const { DataTypes } = require('sequelize');

class Tag {
  static init(sequelize) {
    this.model = sequelize.define(
      'Tag',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        color: {
          type: DataTypes.STRING(7), // Formato: #RRGGBB
          allowNull: true,
          defaultValue: '#3B82F6', // Azul padrão
          validate: {
            is: /^#[0-9A-Fa-f]{6}$/i,
          },
        },
      },
      {
        tableName: 'tags',
        timestamps: true,
        underscored: true,
      }
    );

    return this.model;
  }

  static associate(models) {
    this.model.belongsToMany(models.Task, {
      through: 'task_tags',
      foreignKey: 'tag_id',
      as: 'tasks',
    });
  }
}

module.exports = Tag;
