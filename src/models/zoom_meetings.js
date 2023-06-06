"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var zoom_meetings = sequelize.define('zoom_meetings', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true, //false, 
      primaryKey: true
    },
    summary: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: true, //false, 
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    meeting_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    meeting_starting_time : {
      type : DataTypes.STRING(50),
      allowNull: true,
    },
    meeting_ending_time : {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    meeting_link : {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });


return zoom_meetings;
};