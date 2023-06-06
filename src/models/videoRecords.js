"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var videoRecords = sequelize.define('videoRecords', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        user_id:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        video_name: {
            type: DataTypes.STRING(255),
            allowNull: false, //false, 
        },
        duration:{
            type: DataTypes.STRING(255),
            allowNull: false, //false, 
        },
        total_duration:{
            type: DataTypes.STRING(255),
            allowNull: false, //false, 
        }
    },
    {
        sequelize,
        tableName:'videoRecords',
        timestamps:true,
        indexes:[
            {
                name:"PRIMARY",
                unique:true,
                using:"BTREE",
                fields:[
                    {name:"id"}
                ]
            }
        ]
    }
    );
    
    return videoRecords;
};