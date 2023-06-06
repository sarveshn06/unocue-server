"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var bookmark_program_data = sequelize.define('bookmark_program_data', {
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
        user_id:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        bookmark:{
            type: DataTypes.STRING (20)  ,
            allowNull:true,
            defaultValue: 'false',

           }
        
    });
    
    return bookmark_program_data;
};