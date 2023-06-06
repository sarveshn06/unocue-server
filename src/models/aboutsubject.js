"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  var aboutsubject = sequelize.define('aboutsubject', {
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        primaryKey: true
    },
    course_id:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        reference:{
            model:'course',
            key:'id'
        }
    },
    TraningFocusArea: {
        type: DataTypes.JSON,
        allowNull: true, //false, 
    },
    career_coach_info:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    career_overview:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    salary: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    keyTasks: {
        type: DataTypes.STRING(600),
        allowNull: true, //false, 
    },
    work_culture: {
        type: DataTypes.STRING(600),
        allowNull: true, //false, 
    },
    working_hours:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    places_of_work:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    More_Info:{
        type:   DataTypes.JSON,
        allowNull: true, //false,
    },
    cost_of_education:{
        type:   DataTypes.JSON,
        allowNull: true, //false,
    },
    educational_path:{
        type:   DataTypes.JSON,
        allowNull: true, //false,
    },
    photo:{
        type:DataTypes.STRING(255),
        allowNull: true, //false,
    },
},{
    sequelize,
    tableName:'aboutsubject',
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


return aboutsubject;
};