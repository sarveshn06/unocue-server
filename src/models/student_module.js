"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var student_modules = sequelize.define('student_modules', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        program_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        task_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        module_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        normalQuestion:{
            type:DataTypes.JSON,
            allowNull:true
        },
        videoQuestion:{
            type:DataTypes.JSON,
            allowNull:true
        },
        mcqQuestion:{
            type:DataTypes.JSON,
            allowNull:true
        }
    });
    
    return student_modules;
};