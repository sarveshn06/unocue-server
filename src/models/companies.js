"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var companies = sequelize.define('companies', {
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    overview:{
        type: DataTypes.TEXT,
        allowNull: true, //false,
    },
    location:{
        type: DataTypes.TEXT,
        allowNull: true, //false,
    },
    state: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    district: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    logo:{
        type: DataTypes.TEXT,
        allowNull: true, //false,
    },
    banner:{
        type: DataTypes.TEXT,
        allowNull: true, //false,
    },
    type_of_institute:{
        type:   DataTypes.ENUM,
        values: ['public', 'private', 'deemed']
    },
    status:{
        type:   DataTypes.ENUM,
        values: ['pending', 'approved', 'deleted'],
        defaultValue: 'approved'
    },
    institute_status:{
        type:   DataTypes.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
    },
    established_in: {
        type: DataTypes.DATEONLY,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    contact_number_code: {
        type: DataTypes.STRING(5),
        allowNull: true, //false, 
    },
    contact_number: {
        type: DataTypes.STRING(25),
        allowNull: true, //false, 
    },
    registered_date: {
        type: DataTypes.DATEONLY,
    },
    alternate_email: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    subscription_partnership: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
});


return companies;
};