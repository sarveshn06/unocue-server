"use strict";

module.exports = function(sequelize, DataTypes) {
	var CompanySubscription = sequelize.define("Company_Subscription", {
        user_id:DataTypes.INTEGER,
		start_date: DataTypes.DATEONLY,
		end_date: DataTypes.DATEONLY,
		recurring: DataTypes.ENUM('yes', 'no'),
		status: DataTypes.ENUM('active', 'inactive'),
		payment_mode: DataTypes.ENUM('cheque','dd','online','partnership'),
		payment_status: {
	        type: DataTypes.ENUM,
	        values: ['done', 'pending'],
	        defaultValue: 'pending',
	        allowNull: false
	    },
	    payment_details: DataTypes.STRING(50),
   		payment_date: DataTypes.DATEONLY,
   		order_id: DataTypes.STRING(30),
   		for_account: DataTypes.STRING(25),
    	cheque_no: DataTypes.STRING(25),
    	bank_name: DataTypes.STRING(100),
    	branch_name: DataTypes.STRING(100),
    	dd_no: DataTypes.STRING(25),
		amount: {
	      type: DataTypes.DECIMAL(12, 2),
	      defaultValue: 0.00
	    },
	    tax: {
	      type: DataTypes.DECIMAL(12, 2),
	      defaultValue: 0.00
	    }
	});

  	var Subscription = sequelize.define('Subscription', {});

    CompanySubscription.belongsTo(sequelize.models.Subscription, {foreignKey: 'subscription_id'});

	return CompanySubscription;
};