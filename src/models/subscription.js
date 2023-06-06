"use strict";

module.exports = function(sequelize, DataTypes) {
	var Subscription = sequelize.define("Subscription", {
		name: DataTypes.STRING(50),
		price: DataTypes.STRING(10),
		duration: DataTypes.STRING(20),
		recurring: DataTypes.ENUM('yes', 'no'),  //Added new colom in db - check query log file for it
		status: DataTypes.STRING(10)
	});

	return Subscription;
};
