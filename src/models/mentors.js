const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mentors', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    linkedIn: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    whatsappLink: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    about: {
      type:  DataTypes.TEXT,
      allowNull: false
    },
    achievement: {
        type: DataTypes.JSON,
        allowNull: false
      },
      institute: {
        type: DataTypes.JSON,
        allowNull: true
      },
      testimonial: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      degree:{
        type:DataTypes.JSON,
        allowNull:false
      },
      image:{
        type:DataTypes.STRING(255),
        allowNull:true
      },
      video:{
        type:DataTypes.STRING(255),
        allowNull:true
      }
  }, {
    sequelize,
    tableName: 'mentors',
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
