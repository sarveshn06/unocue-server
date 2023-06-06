"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var subject = sequelize.define('subject', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        sub_name: {
            type: DataTypes.STRING(255),
            allowNull: false, //false, 
        },
    },
    {
        sequelize,
        tableName:'subject',
        timestamps:false,
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
    
    return subject;
};