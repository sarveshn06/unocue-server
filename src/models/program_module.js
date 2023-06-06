"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var program_module = sequelize.define('program_module', {
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
        about: {
            type: DataTypes.TEXT,
            allowNull: false, 
        },
        module:{
            type:DataTypes.JSON,
            allowNull:false
        },
        solution:{
            type:DataTypes.STRING(500),
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
        },
        mime_type:{
            type:DataTypes.STRING(255),
            allowNull:true
        }
    });
    
    return program_module;
};