"use strict";

const { STRING, INTEGER } = require("sequelize");
module.exports=function (sequelize, DataTypes) {
    var course = sequelize.define('course', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false, //false, 
        },
        subjectID:{
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            reference:{
                model:'subject',
                key:'id'
            }
        },
        course_picture:{
            type:DataTypes.STRING(255),
            allowNull:true
        }
    },
    {
        sequelize,
        tableName:'course',
        timestamps:false,
        indexes:[
            {
                name:"PRIMARY",
                unique:true,
                using:"BTREE",
                fields:[
                    {name:"id"}
                ]
            }
        ]
    }
    );
    
    return course;
};