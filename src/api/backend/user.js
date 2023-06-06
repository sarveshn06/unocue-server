const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
var moment = require("moment");
const multer = require('multer');
var fs = require('fs');
const request = require('request');
const config = require('config');
const { serverUrl, type, GOOGLE_MEET_BASE_URL } = config.get('api');
const { QueryTypes } = require('sequelize');
var functions = require(root_path + '/utils/function');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });
const { pdfUserUpload } = require('../../utils/multer')
// const { Refresh_Token } = config.get('api');
// const { Client_ID } = config.get('api');
// const { Secret_Key } = config.get('api');


//Google Calendar Api code starts//
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
// const oAuth2Client = new OAuth2(
// 	Client_ID,
// 	Secret_Key
// )

// oAuth2Client.setCredentials({
// 	refresh_token : Refresh_Token,
// })
// const calendar = google.calendar({ version: 'v3', auth: oAuth2Client})
//Google Calendar Api code ends//

// Multer File upload settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir;
        var upload_option = req.body.upload_option;
        var check = './src/assets/public/upload/user/' + req.body.user_id ;
        if (!fs.existsSync(check)) {
            fs.mkdirSync(check,{ recursive: true });
        }
        if (upload_option == 'task_upload') {
            dir = './src/assets/public/upload/user/' + req.body.user_id + '/' + req.body.program_id;
        } else if (upload_option == 'group_task') {
            dir = './src/assets/public/upload/user/' + req.user.id + '/group_task';
        } else if (upload_option == 'work_task_upload') {
            dir = './src/assets/public/userPdf';
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir,{ recursive: true });
        }
        //   console.log("destination",dir)
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        // console.log("id",req.body.id)
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        //console.log(fileName)
        cb(null, fileName)
    },
})

// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'application/pdf'
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Only pdf allowed!'))
        }
    },
})

//to enroll program
router.post('/enrollStudentforCourse', auth, async (req, res) => {
    try {
        const found = await models.enrolled_users.findOne({ where: { program_id: req.body.program_id, user_id: req.user.id } });
        if (found) {
            res.json({
                status: 400,
                message: "You are already enrolled for this course",
                id: found.id,
                isCertificate: found.certificate
            })
        } else {
            const dataCreated = await models.enrolled_users.create({
                program_id: req.body.program_id,
                user_id: req.user.id,
                degree: req.body.degree,
                email: req.body.email,
                phone: req.body.phone,
                enrolled_date: moment(new Date(functions.get_current_datetime())).format("YYYY-MM-DD"),
            })
            if (dataCreated) {
                var dir = './src/assets/public/upload/user/' + req.user.id;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                res.json({
                    status: 200,
                    meassge: "Successfully saved.",
                    id: dataCreated.id,
                })
            }
        }
    } catch (error) {
        console.log('[-] Error in @route /enrollStudentforCourse method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

router.get('/checkEnrollProgram', auth, async (req, res) => {
    try {
        const found = await models.enrolled_users.findOne({ where: { program_id: req.query.programId, user_id: req.user.id } });
        if (found) {
            res.status(200).json({
                status: true,
                message: "You are already enrolled for this course",
                id: found.id,
                isCertificate: found.certificate
            })
        } else {
            res.status(200).json({
                status: false,
                message: "Data not found.",
            })
        }
    } catch (error) {
        console.log('[-] Error in @route /checkEnrollProgram method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

//upload task program related video 
router.post('/uploadTask', upload.single('avatar'), (req, res, next) => {
    var id = req.body.id;
    if (req.file == undefined) {
        res.status(201).json({
            message: 'No changes to file!',
        })
    } else {
        var minusPublic = (type == 'DEV' ? req.file.path.split('upload\\') : req.file.path.split('upload/'));
        var url = serverUrl + minusPublic[1]
        var condition = {}

        if (req.body.upload_option == 'task_upload') {
            models.enrolled_users_tasks.findOne({
                where: {
                    task_id: req.body.task_id,
                    user_id: req.body.user_id
                }
            }).then(function (task) {
                if (task) {
                    models.enrolled_users.findOne({
                        where: {
                            user_id: req.body.user_id,
                            program_id: req.body.program_id,
                        }
                    }).then(function (enrolled_user) {
                        if (enrolled_user) {
                            task.update({
                                task_id: req.body.task_id,
                                user_id: req.body.user_id,
                                enrolled_users_id: enrolled_user.id,
                                program_id: req.body.program_id,
                                url: url,
                            }).then(function (enrolled_tasks) {
                                if (enrolled_tasks) {
                                    // const percentage=enrolled_tasks.progress
                                    // if(enrolled_tasks.progress!=100){
                                    //     enrolled_tasks.update({
                                    //         progress:percentage+20
                                    //     }).then(progressUpdated=>{
                                    //         console.log('progress updated',progressUpdated)
                                    //     })
                                    // }
                                    res.status(200).json({
                                        message: 'file upload successfully!',
                                        //  avatar: url + '/public/' + req.file.filename,
                                    })
                                } else {
                                    res.status(400).json({
                                        message: 'Enrolled course not found.',
                                    })
                                }
                            })
                        } else {

                        }
                    })
                } else {
                    models.enrolled_users.findOne({
                        where: {
                            user_id: req.body.user_id,
                            program_id: req.body.program_id,
                        }
                    }).then(function (enrolled_user) {
                        if (enrolled_user) {
                            models.enrolled_users_tasks.create({
                                task_id: req.body.task_id,
                                user_id: req.body.user_id,
                                enrolled_users_id: enrolled_user.id,
                                program_id: req.body.program_id,
                                url: url,
                            }).then(function (enrolled_tasks) {
                                if (enrolled_tasks) {
                                    res.status(200).json({
                                        message: 'file upload successfully!',
                                        //  avatar: url + '/public/' + req.file.filename,
                                    })
                                } else {
                                    res.status(400).json({
                                        message: 'Enrolled course not found.',
                                    })
                                }
                            })
                        } else {

                        }
                    })
                }
            })
        }
    }
})

router.post('/enrollStudentForTask', auth, (req, res) => {
    // console.log('enrollStudentForTask',req.body)
    models.enrolled_users_tasks.findOne({
        where: {
            task_id: req.body.task_id,
            program_id: req.body.program_id,
            user_id: req.body.user_id
        }
    }).then(found => {
        if (found) {

        } else {
            models.enrolled_users_tasks.create({
                task_id: req.body.task_id,
                program_id: req.body.program_id,
                user_id: req.body.user_id,
                enrolled_users_id: req.body.enrolled_user_id
            }).then(created => {
                res.status(200).json({
                    status: 200,
                    message: 'task enrolled ...'
                })
            })
        }
    })
})

router.post('/updateUserProfile', auth, (req, res) => {
    //console.log("req.body.formvalue===>"+req.body.formvalue);
    //console.log("req.body.user_id===>"+req.body.user_id);
    var mainvalue;
    var condition;
    if (req.body.type == 'background') {
        mainvalue = req.body.formvalue.background_information;
        condition = {
            background_information: mainvalue
        }
    } else if (req.body.type == 'internship') {
        mainvalue = req.body.formvalue.internship_preferences;
        condition = {
            internship_preferences: mainvalue
        }
    }
    models.users.findOne({
        where: {
            id: req.body.user_id
        }
    }).then(function (user_data) {
        //mainvalue.joinDate = Moment(new Date(mainvalue.joinDate)).tz('Asia/Kolkata').format('YYYY-MM-DD')
        if (user_data) {
            user_data.update(condition).then(function (user_updated) {
                if (user_updated) {
                    res.json({
                        status: 200,
                        meassge: "Successfully saved."
                    })
                } else {
                    res.json({
                        status: 400
                    })
                }
            })
        } else {
            res.json({
                status: 400
            })
        }
    })
})

// router.get('/getApplications', (req, res) => {
//     var tasks_array = [];
//     models.enrolled_users.getApplications(req.query.filter, req.query.type, req.query.application_id, req.query.company_id, req.query.role).then(function(enrolled_data){
//         if(req.query.application_id!=''){
//             models.enrolled_users_tasks.findAll({
//                 where:{
//                     program_id : enrolled_data[0].company_program_id,
//                     user_id : enrolled_data[0].user_id
//                 }
//             }).then(function(completed_tasks){
//                 if(completed_tasks.length > 0){
//                     var count = 0;
//                     completed_tasks.forEach(function(completed_task){
//                         models.tasks.findOne({
//                             where:{
//                                 id : completed_task.task_id
//                             }
//                         }).then(function(task_data){
//                             tasks_array.push({
//                                 program_id : task_data.program_id, 
//                                 task_id : task_data.id,
//                                 task_name : task_data.task_name,
//                                 sub_task_name : task_data.sub_task_name,
//                                 key_area : task_data.key_area,
//                                 task_description : task_data.task_description,
//                                 resource_task : task_data.resource_task,
//                                 user_id : completed_task.user_id,
//                                 enrolled_users_id : completed_task.enrolled_users_id,
//                                 url : completed_task.url,
//                                 final_review : completed_task.task_review
//                             })
//                             count++;
//                             if(count == completed_tasks.length){
//                                 res.json({
//                                     status: 200,
//                                     data : enrolled_data,
//                                     tasks_array : tasks_array
//                                 })
//                             }
//                         })
//                     })
//                 }else{
//                     res.json({
//                         status: 200,
//                         data : enrolled_data
//                     })
//                 }
//             })
//         }else{
//             res.json({
//                 status: 200,
//                 data : enrolled_data
//             })
//         }
//     })
// })

router.get('/getApplications', auth, async (req, res) => {
    try {

        const result = await models.enrolled_users.getEnrolledStudents(req.query.programId)
        res.status(200).json({ data: result })

    } catch (error) {
        console.log('[-] Error in @route /getApplications method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

router.get("/getCities", auth, (req, res) => {
    models.cities.findAll()
        .then(citiesData => {
            res.json({
                status: 200,
                data: citiesData
            })
        })
        .catch(error => {
            console.log('[-] Error in @route /getCities method:get')
            console.log(error)
            res.status(500).json({ status: false, message: 'Something went wrong' })
        })
})

router.post('/saveTaskReview', auth, (req, res) => {
    models.enrolled_users_tasks.findOne({
        where: {
            task_id: req.body.task_id,
            program_id: req.body.program_id,
            user_id: req.body.user_id,
        }
    }).then(function (programtask) {
        if (programtask) {
            programtask.update({
                task_review: req.body.review
            }).then(function (taskreviewupdated) {
                if (taskreviewupdated) {
                    res.json({
                        data: taskreviewupdated,
                        status: 200,
                        message: "Task updated successfully."
                    })
                } else {
                    res.json({
                        status: 400,
                        message: "Task not updated."
                    })
                }
            })
        } else {
            res.json({
                status: 400,
                message: "Task not found."
            })
        }
    })
})

//To get the dashboard data for the particular role
router.get('/getUserDashboard', auth, (req, res) => {
    //console.log(req.query.role)
    //console.log(req.query.user_id)
    models.enrolled_users.getEnrolledData(req.query.user_id, req.query.role).then(function (enrolled_data) {
        if (enrolled_data.length > 0) {
            res.json({
                status: 200,
                data: enrolled_data
            })
        } else {
            res.json({
                status: 400
            })
        }
    })
})

//Goggle meet link event
router.post('/saveMeetingDetail', auth, (req, res) => {

    request.post(GOOGLE_MEET_BASE_URL + 'api/generateGoogleMeetLink', {
        json: {
            meetingDate: req.body.meetingDate,
            meetingStartTime: req.body.meetingStartTime,
            meetingEndTime: req.body.meetingEndTime,
            summary: req.body.summary,
            description: req.body.description
        }
    }, function (error, respo, body) {
        if (respo != undefined) {
            if (body.status == true) {
                res.status(200).json(body)
            } else {
                res.status(200).json(body)
            }
        }
    })
})

//Get All user email id
router.get('/getAllUser', auth, (req, res) => {
    var usersData = []
    models.users.findAll({
        where: {
            role: 'user'
        }
    }).then(function (users_data) {
        //console.log("users_data===>"+users_data);
        if (users_data.length > 0) {
            users_data.forEach(function (user) {
                usersData.push(user.email)
                if (users_data.length == usersData.length) {
                    res.json({
                        status: 200,
                        data: usersData
                    })
                }
            })
        } else {
            res.json({
                status: 400
            })
        }
    })
})

//Get all meeting details
router.get('/getMeetingDetail', (req, res) => {
    models.zoom_meetings.findAll()
        .then(meetingData => {
            res.json({
                status: 200,
                data: meetingData
            })
        })
        .catch(error => {
            console.log('=====Error On meetingData router=====\n', error)
        })
})

//@author - Mamta : save userProfile data
router.post('/saveUserProfile', auth, (req, res) => {
    models.userProfiles.findOne({ where: { user_id: req.body.user_id } }).then(found => {
        if (found) {
            found.update(req.body).then(updated => {
                if (updated) {
                    res.status(200).json({ status: true, message: "updated successfully." })
                }
            })
        } else {
            models.userProfiles.create(req.body).then(inserted => {
                if (inserted) {
                    res.status(200).json({ status: true, message: "Successfully Inserted" })
                }
            })
        }
    }).catch(error => {
        console.log('[-] Error in @route /saveUserProfile method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    })
})

//@authr - Mamta : to get user's profile data by user_id
router.get('/getUserProfile', auth, (req, res) => {
    models.userProfiles.findOne({ where: { user_id: req.query.user_id } }).then(result => {
        if (result) {
            res.status(200).json({ data: result })
        }
    }).catch(error => {
        console.log('[-] Error in @route /getUserProfile method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    })
})

// @route :/get-enroll-user method:get
// @description : to get the enrolled user in workshop
router.get('/get-enroll-user', auth, async (req, res) => {
    try {

        let data = await models.enrolled_workshops.findOne({ where: { workshop_id: req.query.workshop_id, user_id: req.user.id }, raw: true })
        if (data) {
            res.status(200).json({ status: true, message: 'enrolled user', data: data })
        } else {
            res.status(200).json({ status: false, message: "user haven't enroll in the workshop" })
        }
    } catch (e) {
        console.log(`Error in @route: /get-enroll-user method:post \n ${e}`)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
})

//@author - Mamta : to save enrolled workshop data
router.post('/enrollWorkshop', auth, (req, res) => {
    models.enrolled_workshops.findOne({
        where: {
            workshop_id: req.body.workshop_id,
            user_id: req.user.id,
        }
    }).then(data => {
        if (data) {
            res.status(200).json({
                status: 'already',
                message: "You are already enrolled for this workshop",
                id: data.id,
                data: data,
                certificate: data.certificate
            })
        } else {
            if (req.body.option != 'check') {
                models.enrolled_workshops.create({
                    workshop_id: req.body.workshop_id,
                    user_id: req.user.id,
                    degree: req.body.degree,
                    email: req.body.email,
                    phone: req.body.phone,
                    enrolled_date: moment(new Date(functions.get_current_datetime())).format("YYYY-MM-DD"),
                }).then(function (enrolled_workshop_created) {
                    if (enrolled_workshop_created) {
                        res.status(200).json({
                            status: true,
                            meassge: "Successfully saved.",
                            id: enrolled_workshop_created.id
                        })
                    } else {
                        res.json({
                            status: 400,
                            meassge: "Error occured while creating data."
                        })
                    }
                })
            } else {
                res.json({
                    status: 400,
                    meassge: "Data Not Present"
                })
            }
        }
    }).catch(error => {
        console.log('[-] Error in @route /enrollWorkshop method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    })
})

//@author-Mamta : to get bookmarked workshops by user_id
router.get('/getSavedWorkshop', auth, async (req, res) => {
    try {
        const result = await models.sequelize.query(`select w.*,bw.bookmark from workshops w join bookmarkWorkshops bw on bw.workshop_id = w.id where bw.user_id=${req.query.user_id} and bw.bookmark=true`, { types: QueryTypes.SELECT })
        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.log('[-] Error in @route /getSavedWorkshop method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

//@author - Mamta: to get enrolled student of particular workshop by workshop_id
router.get('/getEnrolledWorkshopStudent', auth, async (req, res) => {
    try {
        const result = await models.sequelize.query(`SELECT ew.user_id,u.NAME as name,u.lastname,ew.email,ew.phone,ew.enrolled_date,ew.certificate,ew.id as app_id, ew.GT_completed,ew.IT_completed,ew.quiz_completed,qa.score  FROM users AS u JOIN enrolled_workshops AS ew ON ew.user_id = u.id left join quizAnalytics as qa on qa.user_id = u.id WHERE ew.workshop_id= ${req.query.workshop_id}`, { types: QueryTypes.SELECT })
        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.log('[-] Error in @route /getEnrolledWorkshopStudent method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

//@author- Mamta : to unlock certificate of program
router.post('/unlockCertificate', auth, async (req, res) => {
    try {
        if (req.body.from == 'program') {
            models.enrolled_users.findOne({
                where: {
                    user_id: req.body.user_id,
                    id: req.body.application_id
                }
            }).then(data => {
                if (data) {
                    data.update({
                        certificate: req.body.value
                    }).then(updated => {
                        if (updated) {
                            res.status(200).json({ status: true })
                        }
                    })
                }
            })

        } else {
            models.enrolled_workshops.findOne({
                where: {
                    user_id: req.body.user_id,
                    id: req.body.application_id
                }
            }).then(data => {
                if (data) {
                    data.update({
                        certificate: req.body.value
                    }).then(updated => {
                        if (updated) {
                            res.status(200).json({ status: true })
                        }
                    })
                }
            })
        }
    } catch (error) {
        console.log('[-] Error in @route /unlockCertificate method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.get('/getSavedProgramData', auth, async (req, res) => {
    try {
        let query = 'SELECT cp.backgroundImage,c.NAME AS company_name,c.logo,cp.id AS company_program_id,cp.NAME AS company_program_name,cp.duration,cp.referral_code,cp.LEVEL,bp.bookmark '
        query = query + 'FROM company_programs AS cp JOIN companies AS c ON cp.company_id = c.id '
        query = query + 'LEFT JOIN bookmark_program_data bp ON cp.id = bp.program_id '
        query = query + `WHERE bp.user_id =${req.query.user_id} and bp.bookmark='true'`;
        const result = await models.sequelize.query(query, { types: QueryTypes.SELECT })
        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.log('[-] Error in @route /getSavedProgramData method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.get('/getOngoingProgramData', auth, async (req, res) => {
    try {
        let query = `SELECT c.NAME AS company_name,c.logo,cp.backgroundImage,cp.id AS company_program_id,cp.NAME AS company_program_name,cp.duration,cp.referral_code,cp.LEVEL as level FROM company_programs AS cp JOIN companies AS c ON cp.company_id = c.id join enrolled_users as eu on eu.program_id=cp.id`;
        query = query + ` where eu.user_id=${req.query.user_id} and eu.certificate=0`;
        const result = await models.sequelize.query(query, { types: QueryTypes.SELECT })
        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.log('[-] Error in @route /getOngoingProgramData method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.get('/downloadCertificate', auth, (req, res, next) => {
    const URL = req.query.url;
    var minusPublic = (type == 'DEV' ? URL.split('/') : URL.split('uiserver/'));
    var newURL = (type == 'DEV' ? minusPublic[3] : minusPublic[1]);
    res.download("./src/assets/public/upload/" + newURL, (err) => {
        if (err) {
            next(err)
        }
    })
})


router.get('/getTaskResources', auth, async (req, res) => {
    try {
        const result = await models.uploadTasks.findAll({ where: { task_id: req.query.task_id } })
        res.status(200).json({ status: true, data: result })
    } catch (error) {
        console.log('[-] Error in @route /getTaskResources method:get\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.post('/saveStudentModuleData', auth, async (req, res) => {
    try {
        console.log(req.body);
        const result = await models.student_modules.findOne({
            where: {
                user_id: req.body.user_id,
                module_id: req.body.module_id,
                task_id: req.body.task_id,
                program_id: req.body.program_id,
            }
        })

        if (result) {
            const updated = await models.student_modules.update(req.body, {
                where: {
                    task_id: req.body.task_id,
                    program_id: req.body.program_id,
                    user_id: req.body.user_id,
                    module_id: req.body.module_id
                }
            })

            if (updated) res.status(200).json({ status: true, message: 'updated successfully.', progress: result.progress })

        } else {
            models.student_modules.create(req.body).then(result => {
                if (result) {
                    models.enrolled_users_tasks.findOne({
                        attributes: ['progress'],
                        where: {
                            task_id: req.body.task_id,
                            program_id: req.body.program_id,
                            user_id: req.body.user_id
                        },
                        raw: true
                    }).then(async found => {
                        if (found) {
                            if (found.progress != 100) {
                                let data = await models.enrolled_users_tasks.calculateProgress(req.body.program_id, req.body.task_id, req.body.user_id)
                                console.log('filnal data', data)
                                if (data) {
                                    res.status(200).json({ status: true, message: 'updated successfully.', progress: data })
                                }
                            } else {
                                res.status(200).json({ status: true, message: 'updated successfully.', progress: 100 })
                            }
                        }
                    })
                }
            })
        }



    } catch (error) {
        console.log('[-] Error in @route /saveStudentModuleData method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})


router.post('/upload_student_submission', auth, upload.array('avatar', 10), (req, res) => {
    try {
        if (req.files) {
            req.files.forEach(e => {
                var minusPublic = (type == 'DEV' ? e.path.split('upload\\') : e?.path.split('upload/'));
                var url = serverUrl + minusPublic[1]
                models.student_program_uploads.create({
                    task_id: req.body.task_id,
                    program_id: req.body.program_id,
                    module_id: req.body.module_id,
                    user_id: req.body.user_id,
                    filename: e.filename,
                    mimeType: e.mimetype,
                    url: url,
                    path: e.path
                }).then(created => {
                    if (created) {

                    }
                })
            })
            res.json({ status: 200, message: 'updated successfully...' })
        }
    } catch (error) {
        console.log('[-] Error in @route /upload_student_submission method:post\n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.post('/save_review', auth, (req, res) => {
    try {
        models.enrolled_users.findOne({
            where: { id: req.body.enrolled_user_id }
        }).then(data => {
            if (data) {
                data.update({
                    review: req.body.value
                }).then(updated => {
                    if (updated) {
                        res.status(200).json({ status: true, message: 'updated Successfully..' })
                    }
                })
            }
        })
    } catch (error) {
        console.log('[-] Error in @route /save_review method:post\n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})



router.get('/onGoingWorkshopData', auth, async (req, res) => {
    try {
        const currentTime = moment().utcOffset("+05:30").format('HH:mm')
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD')
        var onGoingData = []
        const ongoing = await models.sequelize.query(`select w.id,w.image,w.name,w.degree,w.agenda from workshops as w inner join enrolled_workshops as ew on ew.workshop_id=w.id where ew.user_id=${req.user.id}`, { types: QueryTypes.SELECT })

        ongoing[0].forEach(e => {
            e.agenda.sort(function (a, b) {
                return a.date.localeCompare(b.date);
            });
            var data1;
            var time1;
            var time2;
            var link;
            for (ag of e.agenda) {
                if (currentDate == ag.date && currentTime >= ag.start_time && currentTime <= ag.end_time) {
                    data1 = ag.date;
                    time1 = ag.start_time;
                    time2 = ag.end_time;
                    link = ag.link;
                    const formdata = {
                        image: e.image,
                        name: e.name,
                        degree: e.degree,
                        date: moment(data1).format('ll'),
                        start_time: moment(time1, ['HH:mm']).format('hh:mm A'),
                        end_time: moment(time2, ['HH:mm']).format('hh:mm A'),
                        link: link
                    }
                    onGoingData.push(formdata)
                    break
                }
            }
        })

        res.json({
            data: onGoingData
        })
    } catch (error) {
        console.log('[-] Error in @route /onGoingWorkshopData method:get \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.get('/upcomingWorkshopData', auth, async (req, res) => {
    try {
        const currentDate = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss")
        var upcomingData = []
        const upcoming = await models.sequelize.query(`select w.id,w.image,w.name,w.degree,w.agenda from workshops as w inner join enrolled_workshops as ew on ew.workshop_id=w.id where ew.user_id=${req.user.id}`, { types: QueryTypes.SELECT })
        upcoming[0].forEach(e => {
            e.agenda.sort(function (a, b) {
                return a.date.localeCompare(b.date);
            });
            var data1;
            var time1;
            var time2;
            var link;
            for (ag of e.agenda) {
                // let workdate=moment(ag.date + ' ' + ag.start_time).utcOffset("+05:30")
                let workdate = moment(moment(ag.date + ' ' + ag.start_time).utc()).utcOffset("+01:00").format("YYYY-MM-DD HH:mm:ss")
                if (moment(currentDate).isBefore(workdate)) {
                    data1 = ag.date;
                    time1 = ag.start_time;
                    time2 = ag.end_time;
                    link = ag.link;
                    const formdata = {
                        image: e.image,
                        name: e.name,
                        degree: e.degree,
                        date: moment(data1).format('ll'),
                        start_time: moment(time1, ['HH:mm']).format('hh:mm A'),
                        end_time: moment(time2, ['HH:mm']).format('hh:mm A'),
                        link: link
                    }
                    upcomingData.push(formdata)
                    break
                }
            }
        })
        res.status(200).json({
            data: upcomingData
        })
    } catch (error) {
        console.log('[-] Error in @route /upcomingWorkshopData method:get \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.get('/workshopAchievements', auth, async (req, res) => {
    try {
        var achievement = [];
        var query = 'select w.id,w.image,w.name,w.degree,w.agenda from workshops as w inner join enrolled_workshops as ew on ew.workshop_id=w.id ';
        query = query + `where ew.user_id=${req.user.id} and ew.certificate=` + 1;
        const workAchievement = await models.sequelize.query(query, { types: QueryTypes.SELECT })
        workAchievement[0].forEach(e => {
            e.agenda.sort(function (a, b) {
                return a.date.localeCompare(b.date);
            });
            const formdata = {
                id: e.id,
                image: e.image,
                name: e.name,
                degree: e.degree,
                date: moment(e.agenda[0].date).format('ll'),
                bookmark: e.bookmark
            }
            achievement.push(formdata)
        })
        res.status(200).json({
            data: achievement
        })
    } catch (error) {
        console.log('[-] Error in @route /workshopAchievements method:get \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.get('/programAchievement', auth, async (req, res) => {
    try {
        var query = "select cp.id as company_program_id,c.id as company_id,cp.backgroundImage,cp.name as company_program_name,c.name as company_name,cp.duration,cp.`level`,c.logo from company_programs as cp inner join enrolled_users as eu on eu.program_id = cp.id INNER JOIN companies as c on cp.company_id=c.id";
        query = query + ` where eu.certificate=1 and eu.progress=100 and eu.user_id=${req.user.id}`;
        const achievement = await models.sequelize.query(query, { types: QueryTypes.SELECT })
        res.status(200).json({
            data: achievement[0]
        })
    } catch (error) {
        console.log('[-] Error in @route /programAchievement method:get \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.post('/upload-group-task', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (req.file == undefined) {
            res.status(201).json({
                message: 'No changes to file!',
            })
        } else {
            var minusPublic = (type == 'DEV' ? req.file.path.split('upload\\') : req.file.path.split('upload/'));
            var url = serverUrl + minusPublic[1]
            const found = await models.student_group_task_uploads.findOne({ where: { user_id: req.user.id, workshop_id: req.body.id } })
            if (found) {
                await found.update({
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimeType: req.file.mimetype,
                    destination: req.file.destination,
                    url: url
                })
            } else {
                await models.student_group_task_uploads.create({
                    workshop_id: req.body.id,
                    user_id: req.user.id,
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    mimeType: req.file.mimetype,
                    destination: req.file.destination,
                    url: url
                })
            }
            await models.enrolled_workshops.update({ GT_completed: 1 }, { where: { workshop_id: req.body.id, user_id: req.user.id } })
            res.status(200).json({ status: true, message: 'file uploaded successfully..' })
        }
    } catch (error) {
        console.log('[-] Error in @route /upload-group-task method:post \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})

router.get('/get-group-task-submission', auth, async (req, res) => {
    try {
        const data = await models.student_group_task_uploads.findOne({ where: { workshop_id: req.query.workshop_id, user_id: req.query.user_id }, attributes: ['url', 'mimeType'] })
        res.status(200).json({ status: true, data: data })
    } catch (error) {
        console.log('[-] Error in @route /get-group-task-submission method:get \n', error)
        res.status(500).json({ status: false, message: 'Somthing went wrong' })
    }
})


router.post('/save-student-workshop-task', auth, async (req, res) => {
    try {
        const found = await models.student_workshop_tasks.findOne({where:{ user_id: req.user.id, workshop_id: req.body.workshop_id } })
        if(found){
            await found.update(req.body);
        }else{
            const data = await models.student_workshop_tasks.create({ ...req.body, user_id: req.user.id });
        }
        res.status(200).json({ status: true, message: 'successfully updated' })
    } catch (error) {
        console.log('[-] Error in @route /save-student-workshop-task method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

router.post('/save-student-worktask-upload', auth, pdfUserUpload.array('pdf'), async (req, res) => {
    try {
        if (req.files == undefined) {
            res.status(201).json({
                message: 'No changes to file!',
            })
        } else {
            const found = await models.student_workshop_tasks.findOne({ where: { user_id: req.user.id, workshop_id: req.body.id } })
            const final = []
            if (found) {
                req.files.forEach(e => {
                    fs.rename(e.path, `${e.path}.pdf`, () => {
                        console.log("\nFile Renamed!\n");
                    });
                    found.uploadQuestion.forEach((data) => {
                        if (e.originalname == data.answer) {
                            const minusPublic = (type == 'DEV' ? e.path.split('upload\\') : e.path.split('upload/'));
                            const url = serverUrl + minusPublic[1];
                            data.answer = url+'.pdf';
                            let newData = { ...data, path: e.path }
                            final.push(newData)
                        }
                    });
                });
            }
            await models.student_workshop_tasks.update({ uploadQuestion: final }, { where: { workshop_id: req.body.id, user_id: req.user.id } })
            await models.enrolled_workshops.update({ IT_completed: 1 }, { where: { workshop_id: req.body.id, user_id: req.user.id } })
            res.status(200).json({ status: true, message: 'file uploaded successfully..' })
        }
    } catch (error) {
        console.log('[-] Error in @route /save-student-worktask-upload method:post\n', error)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

router.post('/upload-user-individual-task', auth, pdfUserUpload.single('pdf'), async function (req, res) {
    try {
        let user = await models.student_workshop_tasks.findOne({ where: { workshop_id: req.body.workShopId, user_id: req.user.id }, raw: true })
        let newPath;
        let uri;
        if (req.file) {
            let data=req.file.path.split('unocueServer/')
            newPath=data[1]
            let ans=req.file.path.split('/upload')
            uri=req.body.uri+ans[1]
        }
        if (user) {
            await models.student_workshop_tasks.update({ mcqQuestion: JSON.parse(req.body.mcqQuestion), videoQuestion: JSON.parse(req.body.videoQuestion), normalQuestion: JSON.parse(req.body.normalQuestion), uploadQuestion: [{ path: `${newPath}.pdf`,answer:`${uri}.pdf`, question: req.body.uploadQuestion }] }, {
                where: { workshop_id: req.body.workShopId, user_id: req.user.id }
            })
        } else {
            let data = await models.student_workshop_tasks.create({
                user_id: req.user.id,
                workshop_id: req.body.workShopId,
                module_id: req.body.module_id,
                mcqQuestion: JSON.parse(req.body.mcqQuestion),
                videoQuestion: JSON.parse(req.body.videoQuestion),
                normalQuestion: JSON.parse(req.body.normalQuestion),
                uploadQuestion: [{ path: `${newPath}.pdf`, answer:`${uri}.pdf`,question: req.body.uploadQuestion }]
            })
            await models.enrolled_workshops.update({ IT_completed: 1 }, { where: { workshop_id: req.body.workShopId, user_id: req.user.id } })
        }
        if (req.file) {
            //Rename file
            fs.rename(req.file.path, `${req.file.path}.pdf`, () => {
                console.log("\nFile Renamed!\n");
            });
        }
        res.status(200).json({ status: true, message: 'task uploaded succesfully' })

    } catch (error) {
        console.log('[-] Error in @route /upload-user-individual-task method:post\n', error)
        res.status(500).json({ status: false, meassge: 'Something went wrong' })
    }
})


module.exports = router;