const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student_program_surveys', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    program_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
    answer:{
        type:DataTypes.JSON,
        allowNull: false
    }
  }, {
    sequelize,
    tableName: 'student_program_surveys',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
