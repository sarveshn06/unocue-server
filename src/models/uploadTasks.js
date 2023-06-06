"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var uploadTasks = sequelize.define('uploadTasks', {
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
        company_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        field:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        filename:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        mimeType:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        url:{
            type:DataTypes.STRING(255),
            allowNull:false
        }
    });


    return uploadTasks;
};