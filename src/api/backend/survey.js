const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
var moment = require("moment");
var Moment = require('moment-timezone');
const multer = require('multer');
var fs = require('fs');
const request = require('request');
const config = require('config');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

router.post('/saveProgramSurvey',auth,async(req,res)=>{
    try{
        models.program_surveys.findOne({where:{program_id:req.body.program_id}}).then(data=>{
            if(data){
                data.update({questions:req.body.questions}).then(updated=>{
                    if(updated){  res.status(200).json({status:true,message:'Updated Successfully...'})}
                })
            }else{
                models.program_surveys.create(req.body).then(created=>{
                    if(created){
                        if(created){  res.status(200).json({status:true,message:'Updated Successfully...'})}
                    }
                })
            }
        })
    }catch(error){
        console.log('[-] Error in @route /saveProgramSurvey method:post\n', error)
        res.status(500).json({ status: 500, message: 'Somthing went wrong' })
    }
})


router.get('/getProgramSurvey',auth,async(req,res)=>{
    try{
        const result=await models.program_surveys.findOne({where:{program_id:req.query.program_id}})
        res.status(200).json({data:result})
    }catch(error){
        console.log('[-] Error in @route /getProgramSurvey method:get\n', error)
        res.status(500).json({ status: 500, message: 'Somthing went wrong' })
    }
})


router.post('/saveStudentSurveyAnswer',auth,async (req,res)=>{
    try{
        models.student_program_surveys.findOne({where:{program_id:req.body.program_id,user_id:req.body.user_id}}).then(data=>{
            if(data){
                data.update({answer:req.body.answer}).then(updated=>{
                    if(updated){  res.status(200).json({status:true,message:'Updated Successfully...'})}
                })
            }else{
                models.student_program_surveys.create(req.body).then(created=>{
                    if(created){
                        if(created){  res.status(200).json({status:true,message:'Updated Successfully...'})}
                    }
                })
            }
        })
    }catch(error){
        console.log('[-] Error in @route /saveStudentSurveyAnswer method:post\n', error)
        res.status(500).json({ status: 500, message: 'Somthing went wrong' })
    }
})

module.exports=router;