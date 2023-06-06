"use strict";

const { condition } = require("sequelize");

module.exports = function(sequelize, DataTypes) {
	var enrolled_users = sequelize.define('enrolled_users', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        program_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        progress:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        enrolled_date:{
            type: DataTypes.DATEONLY,
        },
        certificate:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        review:{
            type: DataTypes.TEXT
        },
        degree: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    });


    enrolled_users.getApplications =async function(filter, type,application_id,company_id, role){
        var condition = ''
        // console.log('====>',filter, '--',type,'---',application_id,'---',company_id)
        if((type==''||type==undefined)&&(filter==''||filter==undefined)){
            if(role == 'company'){
                condition='where cp.company_id='+company_id;
            }else{
                condition='';
            }
        }else if((filter!='' || filter!='undefined') && (type=='' || type==undefined)){
            var filter1 = filter ? filter.replace("[", "(") : '';
            var filter2 = filter1 ? filter1.replace("]", ")") : '';
            if(role == 'company'){
                condition = " Where s.id in "+filter2 +" and cp.company_id="+company_id
            }else{
                condition = " Where s.id in "+filter2
            }
        }else if((type!='' || type!=undefined) && (filter=='' || filter==='undefined')){
            if(role == 'company'){
                condition = `Where usr.referral_code ='${type}' and cp.company_id=${company_id}`
            }else{
                condition = `Where usr.referral_code ='${type}' `
            }
        }else if(type!='' && type!=undefined && filter!='' && filter!='undefined'){
            var filter1 = filter ? filter.replace("[", "(") : '';
            var filter2 = filter1 ? filter1.replace("]", ")") : '';
            if(role == 'company'){
                condition = `Where usr.referral_code ='${type}' and s.id in ${filter2} and cp.company_id=${company_id}`
            }else{
                condition = `Where usr.referral_code ='${type}' and s.id in ${filter2} `
            }
            
        }
        
        if(application_id!=''){
            condition=`where en_usr.id = ${application_id}`
        }
        // console.log('condition---->',condition)
        //referral code from the user table
        var query = "SELECT CONCAT(usr.name,' ',usr.lastname) as student_name, en_usr.id as application_id, en_usr.user_id as user_id, c.name as course_name, s.sub_name as sub_name, usr.referral_code as referral_code,usr.background_information, usr.internship_preferences, usr.photo, ";
        query += " abs. TraningFocusArea, cp.id as company_program_id, com.name as company_name, com.id as company_id, com.user_id as company_user_id from enrolled_users as en_usr ";
        query += " LEFT Join company_programs as cp on cp.id = en_usr.program_id ";
        query += " LEFT Join companies as com on com.id = cp.company_id ";
        query += " LEFT Join course as c on c.id = cp.course_id ";
        query += " LEFT Join subject as s on s.id = c.subjectID ";
        query += " LEFT Join aboutsubject as abs on abs.course_id = c.id ";
        query += " LEFT Join users as usr on usr.id = en_usr.user_id ";
        query += condition;
        return sequelize.query(query, { type: sequelize.QueryTypes.SELECT}); 
    }

    // enrolled_users.getEnrolledData = function(id, role){
    //     var condition = " ";
    //     if(role == 'user'){
    //         condition = " where enr_usr.user_id = "+id;
    //     }else if(role == 'company'){
    //         condition = " where com_prog.company_id = "+id;
    //     }else{
    //         condition = " ";
    //     }

    //     var query = " SELECT usr.name as user_name, usr.lastname as user_lastname, com.name as company_name, com.logo as company_logo, enr_usr.program_id, com_prog.name as program_name, com_prog.description as program_description,GROUP_CONCAT(enr_usr_task.task_id), GROUP_CONCAT(enr_usr_task.task_review) from enrolled_users as enr_usr ";
    //     query += " LEFT JOIN company_programs as com_prog on com_prog.id = enr_usr.program_id ";
    //     query += " LEFT JOIN companies as com on com.id = com_prog.company_id ";
    //     query += " LEFT JOIN enrolled_users_tasks as enr_usr_task on enr_usr_task.program_id = enr_usr.program_id ";
    //     query += " LEFT JOIN users as usr on usr.id = enr_usr.user_id ";
    //     query += condition;
    //     query += " GROUP BY enr_usr.id "
    //     //console.log("query======>"+query);
    //     return sequelize.query(query, { type: sequelize.QueryTypes.SELECT}); 
    // }

    enrolled_users.getEnrolledStudents=async function(program_id){
        console.log('program_id',program_id)
        var query=`select eu.user_id,eu.id as app_id,eu.progress,eu.review,u.name,u.lastname,u.email,u.phone_number,u.photo,eu.certificate from users u join enrolled_users eu on eu.user_id = u.id where eu.program_id=${program_id}`
        return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT}); 
    }

	return enrolled_users;
};