"use strict";

const { STRING, INTEGER, QueryTypes } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var tasks = sequelize.define('tasks', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        task_name: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        sub_task_name: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        key_area: {
            type: DataTypes.JSON,
            allowNull: true, 
        },
        background_info: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        instruction_video: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        resource_task: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        task_description: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        task_logo:{
            type: DataTypes.TEXT,
        },
        program_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        videoDescription:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });

    tasks.getTaskValue=(program_id,user_id)=>{
        return sequelize.query(`select t.*,eut.progress from tasks as t left join enrolled_users_tasks as eut on eut.task_id=t.id and eut.user_id=${user_id} where t.program_id=${program_id}`,{type:QueryTypes.SELECT})
    }

    return tasks;
};