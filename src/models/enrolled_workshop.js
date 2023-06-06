"use strict";

const { condition } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
	var enrolled_workshops = sequelize.define('enrolled_workshops', {
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
        batch: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        degree: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        enrolled_date:{
            type: DataTypes.DATEONLY,
        },
        certificate:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        GT_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        IT_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        quiz_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
	return enrolled_workshops;
};