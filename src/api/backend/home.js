const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });
var models = require(root_path + '/models');
const { QueryTypes, Model } = require('sequelize');
const {global_workshop_search_data,global_program_search,global_program_search_login}=require('../../utils/search')

router.get('/all_Program_list',async(req,res)=>{
    try{
        const pageLimit=6;
        const page=req.query.page;
        let offset=(parseInt(page)-1)*pageLimit;
        let filter=req.query.filter;
        let condition = `SELECT cu.course_picture,c.NAME AS company_name,cp.backgroundImage,c.logo,cp.id AS company_program_id,cp.NAME AS company_program_name,cp.description,cp.testimonials,cp.benefits,cp.steps,cp.video,cp.duration,cp.faculty,cp.referral_code,cp.STATUS,cp.LEVEL FROM company_programs AS cp JOIN companies AS c ON cp.company_id = c.id JOIN course cu ON cu.NAME = cp.NAME WHERE cp.STATUS = 'active' `;
        let countCondition = `SELECT count(*) as count FROM company_programs AS cp JOIN companies AS c ON cp.company_id = c.id JOIN course cu ON cu.NAME = cp.NAME WHERE cp.STATUS = 'active' `
        let filterQuery='';
        if(filter != '' && filter != null && filter != undefined ){
            var filter1=JSON.parse(filter)
            filterQuery=filterQuery+' and ('
            filter1.forEach((ele,index)=>{
                filterQuery=filterQuery + `CONCAT(c.name ,cp.level,cp.name) REGEXP '${ele}'`
                if(index != (filter1.length - 1)){
                    filterQuery=filterQuery + ' OR '
                }else{
                    filterQuery=filterQuery + ')'
                }
            })
        }
        //adding limit and offset
        condition=condition + filterQuery +`limit ${pageLimit} offset ${offset}`;
        countCondition=countCondition + filterQuery;
        const dataCount = await models.sequelize.query(countCondition, { types: QueryTypes.SELECT })
        const result = await models.sequelize.query(condition, { types: QueryTypes.SELECT })
       res.json({
           data: result[0],
           count:dataCount[0][0].count
       })
    }catch(error){
        console.log('[-] Error in @route /all_Program_list method:get')
        console.log(error)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
   
})

router.post('/all_Workshop_list',async(req,res)=>{
    try{
        const pageLimit=6;
        const page=req.body.page;
        let offset=(parseInt(page)-1)*pageLimit;
        let filter=req.body.filter;
        let language=req.body.language_data;
        let degree=req.body.degree_data;
        let stream=req.body.stream_data;
        let condition = '';
        let queryCondition = `SELECT * from workshops `;
        let countCondition = 'select count(*) as count from workshops ';


        if((filter !=''&& filter !=[] && filter !=null && filter!=undefined)||
        (language !=''&& language !=[] && language !=null && language!=undefined)||
        (degree !=''&& degree !=[] && degree !=null && degree!=undefined)||
        (stream !=''&& stream !=[] && stream !=null && stream!=undefined)
        ){
            condition = condition +' where'
        }
        if(filter !=''&& filter !=[] && filter !=null && filter!=undefined){
            var filter1=JSON.parse(filter)
            for(let i=0;i < filter1.length;i++){
                condition = condition +( (i==0)? '' : ' OR')
                condition = condition+`  CONCAT(name,stream,degree,language ) REGEXP '${filter1[i]}'`
            }
        }

        if(language !=''&& language !=[] && language !=null && language!=undefined){
            if(filter !=''&& filter !=[] && filter !=null && filter!=undefined){
                condition = condition+' OR'
            }
            for(let i=0;i < language.length;i++){
                condition = condition +( (i==0)? '' : ' OR')
                condition = condition+` language REGEXP '${language[i]}'`
            }
        }
        if(degree !=''&& degree !=[] && degree !=null && degree!=undefined){
            if((language !=''&& language !=[] && language !=null && language!=undefined)||(filter !=''&& filter !=[] && filter !=null && filter!=undefined)){
                condition = condition+' OR'
            }
            for(let i=0;i < degree.length;i++){
                condition = condition +( (i==0)? '' : ' OR')
                condition = condition+` degree REGEXP '${degree[i]}'`
            }
        }
        if(stream !=''&& stream !=[] && stream !=null && stream!=undefined){
            if((degree !=''&& degree !=[] && degree !=null && degree!=undefined)||
            (filter !=''&& filter !=[] && filter !=null && filter!=undefined)||
            (language !=''&& language !=[] && language !=null && language!=undefined)){
                condition = condition+' OR'
            }
            for(let i=0;i < stream.length;i++){
                condition = condition +( (i==0)? '' : ' OR')
                condition = condition+` stream REGEXP '${stream[i]}'`
            }
        }

        //adding limit and offset
        queryCondition=queryCondition+condition+` limit ${pageLimit} offset ${offset}`;
        countCondition=countCondition+condition;
        console.log(queryCondition)
        const result = await models.sequelize.query(queryCondition, { types: QueryTypes.SELECT });
        const dataCount = await models.sequelize.query(countCondition, { types: QueryTypes.SELECT })
       res.json({
           data: result[0],
           count:dataCount[0][0].count
       })
    }catch(error){
        console.log('[-] Error in @route /all_Program_list method:get')
        console.log(error)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
   
})

//TO get the faculty name according user's referral code
router.get('/getFaculty', async function (req, res) {
    try {
        var result;
        if(req.query.code){
            result = await models.sequelize.query(`select name from companies where id in (select distinct(company_id) from company_programs where referral_code='${req.query.code}')`, { types: QueryTypes.SELECT })
        }else{
            result = await models.sequelize.query(`select name from companies where id in (select distinct(company_id) from company_programs)`, { types: QueryTypes.SELECT })
        }
        
        if (result) {
            res.json({
                status: 200,
                data: result[0]
            })
        }
    } catch (error) {
        console.log('[-] Error in @route /getFaculty method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.get('/getDegreesAndStream',async(req,res)=>{
    try{
        const result=await models.degrees.findAll();
        const stream=await models.streams.findAll({attributes:['name']})
        res.status(200).json({status:true,data:{degree:result,stream:stream}})
    }catch(error){
        console.log('[-] Error in @route /getDegreesAndStream method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.get('/globalSearch',async(req,res)=>{
    try{
        const data=req.query.searchData;
        //work-experience-program
        ProgramResult = await global_program_search(data);
        //workshop
        WorkshopResult=await global_workshop_search_data(data);
        res.status(200).json({
            status:true,
            data:{
                program:ProgramResult[0],
                workshop:WorkshopResult[0]
            }
        })
    }catch(error){
        console.log('[-] Error in @route /globalSearch method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.get('/globalSearchAfterLogin',auth,async(req,res)=>{
    try{
        const data=req.query.searchData;
        //work-experience-program
        ProgramResult = await global_program_search_login(data,req.user)
        //workshop
        WorkshopResult= await global_workshop_search_data(data)
        res.status(200).json({
            status:true,
            data:{
                program:ProgramResult[0],
                workshop:WorkshopResult[0]
            }
        })
    }catch(error){
        console.log('[-] Error in @route /globalSearchAfterLogin method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.post('/recentview',auth,async (req,res)=>{
    try{
        const found=await models.recentViews.findOne({
            where:{
                name:req.body.name,
                user_id:req.body.user_id
            },raw:true
        })
        if(found){
            await models.recentViews.update({name:req.body.name},{where:{name:req.body.name,user_id:req.body.user_id}})
            res.status(200).json({status:true,data:'updated successfully'})

        }else{
            const createdData=await models.recentViews.create({
                user_id:req.body.user_id,
                name:req.body.name
            })
            if(createdData){
                const count=await models.recentViews.count({where:{user_id:req.body.user_id}});
                if(count>20){
                    await models.recentViews.destroy({
                        where:{user_id:req.body.user_id},
                        order:[['updatedAt','DESC']],
                        limit:1
                    })
                }
            }
            res.status(200).json({status:true,data:'created successfully'})
        }


    }catch(error){
        console.log('[-] Error in @route /recentview method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.get('/getRecentReview',auth,async(req,res)=>{
    try{
        const result=await models.recentViews.findAll({
            attributes:['name'],
            where:{
                user_id:req.user.id
            },
            order:[['updatedAt','DESC']],
            limit:20
        })
        res.status(200).json({data:result})

    }catch(error){
        console.log('[-] Error in @route /getRecentReview method:get \n',error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


module.exports = router;

