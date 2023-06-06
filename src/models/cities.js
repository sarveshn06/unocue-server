"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var cities = sequelize.define('cities', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: true,  
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: true, 
        },
    },
    {
        sequelize,
        timestamps:false
    }
    );


    return cities;
};