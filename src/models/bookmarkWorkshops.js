"use strict";

const { condition } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
	var bookmarkWorkshops = sequelize.define('bookmarkWorkshops', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        workshop_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        bookmark:{
            type: DataTypes.BOOLEAN,
            allowNull: true, //false, 
            defaultValue: 0
        }
    });
    return bookmarkWorkshops;
};