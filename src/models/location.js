"use strict";

module.exports = function (sequelize, DataTypes) {
    var location = sequelize.define('location', {
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
        timestamps:false,
        tableName: 'location',
    }
    );


    return location;
};