"use strict";

const { STRING, INTEGER } = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  var user_activity_analytics = sequelize.define('user_activity_analytics', {
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        primaryKey: true
    },
    course_id:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
    },
    user_id:{
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    mind_map: {
        type: DataTypes.JSON,
        allowNull: true, //false, 
    },
    keywords:{
        type: DataTypes.TINYINT,
        allowNull: true, //false,
    },
    big_wigs:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    right_pick:{
        type: DataTypes.TINYINT,
        allowNull: true, //false,
    },
    journeys: {
        type: DataTypes.JSON,
        allowNull: true, //false, 
    },
    idea_board: {
        type: DataTypes.TEXT,
        allowNull: true, //false, 
    },
    news_and_views:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    speak_up:{
        type: DataTypes.JSON,
        allowNull: true, //false,
    },
    note_square:{
        type:DataTypes.JSON,
        allowNull: true, //false,
    },
    in_my_opinion:{
        type:DataTypes.JSON,
        allowNull: true, //false,
    },
   
},{
    sequelize,
    tableName:'user_activity_analytics',
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


return user_activity_analytics;
};