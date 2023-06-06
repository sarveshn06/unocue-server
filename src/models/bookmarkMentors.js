"use strict";

const { condition } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
	var bookmarkMentors = sequelize.define('bookmarkMentors', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        mentor_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    });
    return bookmarkMentors;
};