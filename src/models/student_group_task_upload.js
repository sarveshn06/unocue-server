"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var student_group_task_uploads = sequelize.define('student_group_task_uploads', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        workshop_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        filename:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        originalname:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        mimeType:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        destination:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        url:{
            type:DataTypes.STRING(255),
            allowNull:false
        }
    });


    return student_group_task_uploads;
};