"use strict";

module.exports = function(sequelize, DataTypes) {
	var enrolled_users_tasks = sequelize.define('enrolled_users_tasks', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        task_id:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        url:{
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        enrolled_users_id:{
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        program_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        task_review:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        progress:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        }
    });
	
    enrolled_users_tasks.calculateProgress=async(program_id,task_id,user_id)=>{

        //For task progress

        var query1=`select count(*) as count from program_modules where program_id=${program_id} and task_id=${task_id}`
        const total_modules= await sequelize.query(query1, { type: sequelize.QueryTypes.SELECT}); 
        
        var query2=`select count(*) as count from student_modules where program_id=${program_id} and task_id=${task_id} and user_id=${user_id}`
        const complete_module_by_student= await sequelize.query(query2, { type: sequelize.QueryTypes.SELECT}); 
        

        const percentage=(parseInt(complete_module_by_student[0].count)/parseInt(total_modules[0].count))*100;

        const taskPercentage = await sequelize.query(`update enrolled_users_tasks set progress=${percentage} where program_id=${program_id} and task_id=${task_id} and user_id=${user_id}`,{type:sequelize.QueryTypes.UPDATE})

        // For program Progress

        var query3=`select count(*)*100 as count from tasks where program_id=${program_id}`
        var query4=`select sum(progress) as total_progress from enrolled_users_tasks where program_id=${program_id} and user_id=${user_id}`


        var total_task= await sequelize.query(query3,{type:sequelize.QueryTypes.SELECT})
        var total_task_progress= await sequelize.query(query4,{type:sequelize.QueryTypes.SELECT})

        const total_program_progress=(parseInt(total_task_progress[0].total_progress)/parseInt(total_task[0].count))*100;
        console.log('total_program_progress',total_program_progress)

        await sequelize.query(`update enrolled_users set progress=${total_program_progress} where program_id=${program_id} and user_id=${user_id}`,{type:sequelize.QueryTypes.UPDATE});
        return percentage;

    }
	return enrolled_users_tasks;
};