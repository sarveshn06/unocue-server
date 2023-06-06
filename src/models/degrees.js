"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var degrees = sequelize.define('degrees', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,  
        },
        abbreviation: {
            type: DataTypes.STRING(255),
            allowNull: true, 
        },
    },
    {
        sequelize,
        timestamps:false
    }
    );


    return degrees;
};