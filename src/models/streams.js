"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var streams = sequelize.define('streams', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,  
        }
    },
    {
        sequelize,
        timestamps:false
    }
    );


    return streams;
};