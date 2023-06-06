"use strict";

const { STRING, INTEGER } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    var workshops = sequelize.define('workshops', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false, 
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false, 
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        stream:{
            type: DataTypes.STRING(100),
            allowNull: true, 
        },
        degree: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        testimonials:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        benefits:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        speaker:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        image:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        certificate:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        company_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        language:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        topic:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        agenda:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        whatsapp_link:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        meet_link:{
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        batch:{
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        group_task: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        individual_task: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        quiz: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    });


    workshops.getWorkshopData=async function(data){
        let page=(data.page)?(data.page):1;
        let pageLimit=(data.pagelimit)?(data.pagelimit):9;
        let offset=(parseInt(page)-1)*pageLimit;
        let filter=data.filter
        let language=data.language_data;
        let degree=data.degree_data;
        let stream=data.stream_data;
        var filterquery='';

        var query=`select w.id,w.name,w.degree,w.agenda,w.image,bw.bookmark from workshops as w left join bookmarkWorkshops as bw on bw.workshop_id = w.id `

        query=query+(data.user_id?`AND bw.user_id=${data.user_id}`:'')

        var countQuery = `select count(*) as count from workshops as w left join bookmarkWorkshops as bw on bw.workshop_id = w.id `;
        countQuery=countQuery+(data.user_id?`AND bw.user_id=${data.user_id}`:'')

        if((filter !=''&& filter !=[] && filter !=null && filter!=undefined)||
        (language !=''&& language !=[] && language !=null && language!=undefined)||
        (degree !=''&& degree !=[] && degree !=null && degree!=undefined)||
        (stream !=''&& stream !=[] && stream !=null && stream!=undefined)
        ){
            filterquery = filterquery +' where'
        }
        if(filter !=''&& filter !=[] && filter !=null && filter!=undefined){
            for(let i=0;i < filter.length;i++){
                filterquery = filterquery +( (i==0)? '' : ' OR')
                filterquery = filterquery+`  CONCAT( w.name,w.stream,w.degree,w.language ) REGEXP '${filter[i]}'`
            }
        }

        if(language !=''&& language !=[] && language !=null && language!=undefined){
            if(filter !=''&& filter !=[] && filter !=null && filter!=undefined){
                filterquery = filterquery+' OR'
            }
            for(let i=0;i < language.length;i++){
                filterquery = filterquery +( (i==0)? '' : ' OR')
                filterquery = filterquery+`  w.language REGEXP '${language[i]}'`
            }
        }
        if(degree !=''&& degree !=[] && degree !=null && degree!=undefined){
            if((language !=''&& language !=[] && language !=null && language!=undefined)||(filter !=''&& filter !=[] && filter !=null && filter!=undefined)){
                filterquery = filterquery+' OR'
            }
            for(let i=0;i < degree.length;i++){
                filterquery = filterquery +( (i==0)? '' : ' OR')
                filterquery = filterquery+` w.degree REGEXP '${degree[i]}'`
            }
        }
        if(stream !=''&& stream !=[] && stream !=null && stream!=undefined){
            if((degree !=''&& degree !=[] && degree !=null && degree!=undefined)||
            (filter !=''&& filter !=[] && filter !=null && filter!=undefined)||
            (language !=''&& language !=[] && language !=null && language!=undefined)){
                filterquery = filterquery+' OR'
            }
            for(let i=0;i < stream.length;i++){
                filterquery = filterquery +( (i==0)? '' : ' OR')
                filterquery = filterquery+`  w.stream REGEXP '${stream[i]}'`
            }
        }

        query=query+ filterquery +`  limit ${pageLimit} offset ${offset}`;
        countQuery=countQuery + filterquery ;

        const dataCount=await sequelize.query(countQuery, { type: sequelize.QueryTypes.SELECT}); 
        const allData= await sequelize.query(query, { type: sequelize.QueryTypes.SELECT}); 
        return {count : dataCount , data:allData}
    }

    return workshops;
};