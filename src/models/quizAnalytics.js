const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var quizAnalytics = sequelize.define('quizAnalytics', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            reference: {
                model: 'users',
                key: 'id'
            }
        },
        workShop_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            reference: {
                model: 'workshops',
                key: 'id'
            }
        },
        quiz_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            reference: {
                model: 'quiz',
                key: 'id'
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
        {
            sequelize,
            tableName: 'quizAnalytics',
            timestamps: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" }
                    ]
                }
            ]
        })
    return quizAnalytics;
}