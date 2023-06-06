"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var faculties = sequelize.define('faculties', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true, //false, 
        },
    });
    
    return faculties;
};