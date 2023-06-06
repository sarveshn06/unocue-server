"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  var activities = sequelize.define('activities', {
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
    mind_map: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    keywords:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    big_wigs:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    right_pick:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    journeys: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    idea_board: {
        type: DataTypes.STRING(255),
        allowNull: true, //false, 
    },
    news_and_views:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    speak_up:{
        type: DataTypes.STRING(255),
        allowNull: true, //false,
    },
    note_square:{
        type:DataTypes.JSON,
        allowNull:JSON, //false,
    },
    in_my_opinion:{
        type:DataTypes.STRING(255),
        allowNull: true, //false,
    }
},{
    sequelize,
    tableName:'activities',
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


return activities;
};