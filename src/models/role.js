"use strict";

module.exports = function(sequelize, DataTypes) {
	var roles = sequelize.define('roles', {
		id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Dashboard: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Applications: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Role_Management: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Work_Experiment_Programs: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Program_Approval: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Program_Management: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Workshop_Management: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Course_Management: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Meeting_Management: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Reports: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Jobs: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Mentor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: true, 
          },
          Workshops: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        Blogs: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
	
	return roles;
};