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
const { QueryTypes } = require('sequelize');
const { serverUrl } = config.get('api');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

router.get('/getCompanyInfo', auth,async function (req, res) {
  const company = await models.sequelize.query("SELECT comp.name as company_name, comp.overview as company_overview, comp.location as company_location, comp.state as company_state, comp.city as company_city, comp.district as company_district, comp.logo as company_logo, com_prog.name as program_name, com_prog.description as program_description, com_prog.duration as program_duration, com_prog.testimonials as program_testimonials, com_prog.benefits as program_benefits, com_prog.steps as program_steps, com_prog.video as program_video, t.task_name, t.background_info as task_info, t.task_description as task_description, t.instruction_video as task_instruction_video, t.resource_task as task_resource from company_programs as com_prog LEFT JOIN companies as comp on comp.id = com_prog.company_id LEFT JOIN tasks as t on t.program_id = com_prog.id", { types: QueryTypes.SELECT })
  //  console.log(aboutCourse);
  res.json({
    data: company
  })
})
router.get('/getjob',auth, async function (req, res) {

  let id = req.query.id
console.log("dcbhcb",id)
  const company = await models.sequelize.query("select c.id,c.name,s.sub_name,cp.id as company_program_id,com.id as company_id,com.name as company_name from course c join `subject` s on c.subjectID = s.id left join company_programs as cp on cp.course_id = c.id left join companies as com on com.id = cp.company_id where c.id ="+id+"  Order by c.id desc", { types: QueryTypes.SELECT })
  res.status(200).json({status:true,data:company})
})


//Get company wise jobs list
router.get('/getJobsData', auth,(req, res) => {
  //console.log("getJobsData getJobsData getJobsData==>"+req.query.filter);
  var condition = {};
  var progarmsData = [];
  if(req.query.role == 'company'){
      models.company_jobs.findAll({
          where : {
              company_id : req.query.company_id
          }
      }).then(function(alljobs){
          res.json({
              status: 200,
              data : alljobs
          })
      })
  }else if(req.query.role == 'user'){
      // models.company_programs.getCollegeData(req.query.filter,req.query.code).then(function(allprogarms){
      //     //console.log("JSON.stringify(allprogarms)==>"+JSON.stringify(allprogarms));
      //     allprogarms.forEach(function(progam){
      //         progarmsData.push({
      //             company_name : progam.company_name,
      //             company_program_id : progam.company_program_id,
      //             company_program_name : progam.company_program_name,
      //             description : progam.description,
      //             testimonials : progam.testimonials,
      //             benefits : progam.benefits,
      //             steps : progam.steps,
      //             video : progam.video,
      //             duration : progam.duration,
      //             faculty : progam.faculty,
      //             logo : progam.logo
      //         })
      //     })
      //     res.json({
      //         status: 200,
      //         data : allprogarms
      //     })
      // })
  }else{
      models.company_jobs.findAll().then(function(alljobs){
          res.json({
              status: 200,
              data : alljobs
          })
      })
  }
})

//delete single job
router.post('/deleteJobData', auth,(req, res) => {
  //console.log("req.body.job_id====>"+req.body.job_id)
  models.company_jobs.findOne({
      where : {
          id : req.body.job_id
      }
  }).then(jobdata=>{
      if(jobdata){
          models.company_jobs.destroy({
              where : {
                  id : req.body.job_id
              }
          }).then(function(job_deleted){
              if(job_deleted){
                  res.json({
                      status : 200
                  })
              }else{
                  res.json({
                      status : 400,
                      message : 'Comapny program is not deleted.'
                  })
              }
          })
      }
  })
 
})

//Save & Update company wise job details
router.post('/saveJobData',auth, (req, res) => {
  //console.log("req.body.JobData====>"+req.body.JobData)
  var JobData = req.body.JobData
  if(JobData.JobId == null || JobData.JobId == '' || JobData.JobId == undefined ){
      models.company_jobs.create({
        title: JobData.title,
        description: JobData.description,
        overview: JobData.overview,
        role_responsibilites: JobData.role,
        qualification: JobData.qualification,
        salary: JobData.salary,
        location: JobData.location,
        company_id: JobData.company_id,
        company_courses: JobData.course_name,
      }).then(function(companyjob){
          if(companyjob){
              res.json({
                  status : 200,
                  data : companyjob.id
              })
          }else{
              res.json({
                  status : 400,
                  message : 'Comapny Job is not created.'
              })
          }
      })
  }else{
      models.company_jobs.findOne({
          where :{
              id : JobData.JobId
          }
      }).then(function(companyjob){
          if(companyjob){
            companyjob.update({
              title: JobData.title,
              description: JobData.description,
              overview: JobData.overview,
              role_responsibilites: JobData.role,
              qualification: JobData.qualification,
              salary: JobData.salary,
              location: JobData.location,
              company_id: JobData.company_id,
              company_courses: JobData.course_name,
            }).then(function(companyjobupdated){
                if(companyjobupdated){
                    res.json({
                        data : companyjobupdated.id,
                        status:200,
                        message:"Company Job updated successfully."
                    })
                }else{
                    res.json({
                        status:400,
                        message:"Company Job not updated."
                    })
                }
              })
          }else{
              res.json({
                  status:400,
                  message:"Company Job not found."
              })
          }
      })
  }
})

//Get single job data
router.get('/getJobValues',auth, (req, res) => {
  if(req.query.role == 'user'){
      models.company_jobs.findOne({
          where:{
              id : req.query.jobId,
          }
      }).then(function(job_data){
          // models.companies.findOne({
          //     where :{
          //         id : job_data.company_id,
          //     }
          // }).then(function(company_data){
              //console.log("company_data[====>"+JSON.stringify(company_data))
              res.json({
                  status: 200,
                  data : job_data,
                 // company_data : company_data
              })
          //})
      })
  }else{
      models.company_jobs.findOne({
          where:{
              id : req.query.jobId,
          }
      }).then(function(job_data){
          res.json({
              status: 200,
              data : job_data
          })
      })
  }
})

//Get Company Courses for Jobs
router.get('/getCompanyCourse',auth, (req, res) => {
  var course_data = [];
  var count = 0;
  models.company_jobs.getCompanyCourse(req.query.company_id,req.query.role).then(function(courses){
    courses.forEach(course => {
      course_data.push(course.company_program_name)
      count++;
      if(count == courses.length){
        res.json({
          status: 200,
          data : course_data
        });
      }
    });
  })
})
module.exports = router;