"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true, //false, 
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: true, //false, 
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    gender:{
      type:   DataTypes.ENUM,
      values: ['Male', 'Female', 'Other'],
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true, //false,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
    active_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true, //false, 
      defaultValue: 1
    },
    dark_mode: {
      type: DataTypes.BOOLEAN,
      allowNull: true, //false, 
      defaultValue: 0
    },
    messenger_color: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
      defaultValue: "#2180f3"
    },
    email_verified_at: {
      type: DataTypes.INTEGER,
      allowNull: true, //false, 
      defaultValue: 0
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
    Leaves: {
     type:DataTypes.JSON,
     allowNull:true
    },
      avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
      lang: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
      last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
      is_active: {
      type: DataTypes.INTEGER,
      allowNull: true, //false, 
      defaultValue: 1
    },
      created_by: {
      type: DataTypes.STRING(255),
      allowNull: true, //false, 
    },
      remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone_number_code: {
        type: DataTypes.STRING(5),
        allowNull: true, //false, 
    },
    phone_number: {
        type: DataTypes.STRING(25),
        allowNull: true, //false, 
    },
    internship_preferences: {
      type: DataTypes.JSON,
      allowNull: true, 
    },
    background_information: {
      type: DataTypes.JSON,
      allowNull: true, 
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true, //false, 
    },
    otp:{
      type: DataTypes.STRING(10),
      allowNull: true, 
    },
    user_id:{
      type: DataTypes.STRING(50),
      allowNull: true, 
    },
    referral_code:{
      type:DataTypes.STRING,
      allowNull:true
    },
    verification_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    otp_verified_at: {
      type: DataTypes.INTEGER,
      allowNull: true, //false, 
      defaultValue: 0
    },
  });


return users;
};