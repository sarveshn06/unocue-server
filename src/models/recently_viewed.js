"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
    var recentViews = sequelize.define('recentViews', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        // field: {
        //     type: DataTypes.STRING(255),
        //     allowNull: true,  
        // },
        // data_id: {
        //     type: DataTypes.STRING(255),
        //     allowNull: true,  
        // },
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: true,  
        },
        name:{
            type: DataTypes.STRING(255),
            allowNull: true,  
        }
    },
    {
        sequelize
    }
    );


    return recentViews;
};