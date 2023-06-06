"use strict";
module.exports = function(sequelize, DataTypes) {
	var enrolled_mentors = sequelize.define('enrolled_mentors', {
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
        goal:{
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        session_date:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        session_time:{
            type: DataTypes.TIME,
            allowNull: false,
        },
        confirmation:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        session_link:{
            type:DataTypes.STRING(255)
        }
    });
	return enrolled_mentors;
};