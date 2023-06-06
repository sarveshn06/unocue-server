"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var student_workshop_tasks = sequelize.define('student_workshop_tasks', {
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
        },
        uploadQuestion:{
            type:DataTypes.JSON,
            allowNull:true
        }
    });
    
    return student_workshop_tasks;
};