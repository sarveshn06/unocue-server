const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {

    var quiz = sequelize.define('quiz', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        questions:{
            type:DataTypes.JSON,
            allowNull:false
        },
        WorkShop_id:{
            type:DataTypes.BIGINT.UNSIGNED,
            allowNull:false,
            reference:{
                model:'workshops',
                key:'id'
            } 
        }
        // [
        //     {
        //         questionTitle:{
        //             type:DataTypes.STRING(255),
        //             allowNull:true
        //         },
        //         answerOptions:[
        //             {
        //                 answerBody:{
        //                     type: DataTypes.STRING(255),
        //                     allowNull: false,
        //                 }  ,
        //                 isCorrectAnswer:{
        //                     type: DataTypes.BOOLEAN,
        //                     allowNull: false,
        //                 }

        //             }
        //         ]

        //     }
        // ]
    },
    {
        sequelize,
        tableName:'quiz',
        timestamps:true,
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
    })
    return quiz;
}