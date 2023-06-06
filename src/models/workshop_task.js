"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var workshop_tasks = sequelize.define('workshop_tasks', {
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
        // about: {
        //     type: DataTypes.TEXT,
        //     allowNull: false, 
        // },
        questions:{
            type:DataTypes.JSON,
            allowNull:false
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
        },
        solution:{
            type:DataTypes.STRING(500),
            allowNull:true
        },
        filename:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        destination:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        mime_type:{
            type:DataTypes.STRING(255),
            allowNull:true
        }
    });
    
    return workshop_tasks;
};