"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var userProfiles = sequelize.define('userProfiles', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: false, 
        },
        skill:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        occupation:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        industry:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        level:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        university:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        degree_of_edu:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        major:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        division:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        linkedin:{
            type:DataTypes.STRING(255),
            allowNull:true
        },

    });
    
    return userProfiles;
};