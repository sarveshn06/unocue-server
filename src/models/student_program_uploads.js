"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var student_program_uploads = sequelize.define('student_program_uploads', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        task_id:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        program_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        module_id: {
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
        mimeType:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        path:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        url:{
            type:DataTypes.STRING(255),
            allowNull:false
        }
    });


    return student_program_uploads;
};