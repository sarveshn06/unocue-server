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
const { QueryTypes, where } = require('sequelize');
const { serverUrl } = config.get('api');
const { type } = config.get('api');
var rimraf = require('rimraf');
const { builtinModules } = require('module');
const { json } = require('body-parser');
const {VideoUpload}=require('../../utils/multer')
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

router.get('/getCourseInfo', auth,async function (req, res) {
    const aboutCourse = await models.sequelize.query("select c.name,s.sub_name,a.* from course c join subject s on c.subjectID = s.id join aboutsubject a on a.course_id = c.id", { types: QueryTypes.SELECT })
    //  console.log(aboutCourse);
    res.json({
        data: aboutCourse
    })
})

// @route : /getCourseInfo method:post
// @description: to the get cousre coach details by coure id 
router.post('/getCourseInfo', auth,async function (req, res) {
    try {
        var id = req.body.id;
        const aboutCourse = await models.sequelize.query(`select c.name,s.sub_name,a.* from course c join subject s on c.subjectID = s.id join aboutsubject a on a.course_id = c.id where a.course_id =${id}`, { types: QueryTypes.SELECT })
        res.status(200).json({ status: true, data: aboutCourse })
    } catch (e) {
        console.log('[-] Error in @route /getCourseInfo method:post')
        console.log(e)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }

})

// @route : /getActivityInfo method:post
// @description : to get the activity tab data
// const aboutActivity = await models.sequelize.query(`SELECT * FROM activities where course_id= ${course_id}`, { types: QueryTypes.SELECT });
router.post('/getActivityInfo', auth,async function (req, res) {
    try {
        course_id = req.body.courseId
        const aboutActivity = await models.activities.findOne({ where: { course_id: course_id } })
        res.status(200).json({ status: true, data: aboutActivity })
    } catch (e) {
        console.log('[-] Error in @route /getActivityInfo method:post')
        console.log(e)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    }
})

// @route :/getActivityData method:post
// @description : to get the bigwig data with course_id
router.post('/getActivityData', auth,async function (req, res) {
    try {
        course_id = req.body.courseId
        attry = req.body.att
        const activityData = await models.activities.findOne({ where: { course_id: course_id }, attributes: [attry] })
        res.status(200).json({ status: true, data: activityData })
    } catch (e) {
        console.log('[-] Error in @route /getActivityData method:post')
        console.log(e)
        res.status(500).json({ staus: false, message: 'Somthing went wrong' })
    }
})

router.get('/getSubject',auth, async function (req, res) {
    const aboutSubject = await models.sequelize.query("select c.id,c.name,c.course_picture,s.sub_name from course c join `subject` s on c.subjectID = s.id order by id desc", { types: QueryTypes.SELECT })
    // console.log(aboutSubject);
    res.json({
        data: aboutSubject
    })
})

router.get('/getIndividualCourse', auth,async function (req, res) {
    const aboutSubject = await models.sequelize.query("select c.name,c.course_picture,s.sub_name,a.* from course c join subject s on c.subjectID = s.id join aboutsubject a on a.course_id = c.id where c.id=" + req.query.id, { types: QueryTypes.SELECT })
    //console.log('aboutsubject ',aboutSubject)
    // console.log("mydata---------------",aboutSubject[0][0]);
    res.json({
        data: aboutSubject[0][0]
    })


})

router.get('/getIndividualSubject',auth, async function (req, res) {
    const aboutSubject = await models.sequelize.query("select c.name,s.sub_name from course c join subject s on c.subjectID = s.id where c.id=" + req.query.course_id, { types: QueryTypes.SELECT })
    res.json({
        data: aboutSubject[0][0]
    })
})

var Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const source=req.body.source;
        if(source=='profile'){
            var dir = './src/assets/public/upload/course/' + req.body.id;
        }else if(source=='course_picture'){
            var dir = './src/assets/public/upload/course/coursePicture/'+req.body.id;
        }
       
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            }, (error) => {
                if (error)
                    console.log('ErrorMessage:' + error)
                else
                    console.log('directory successfully created..')
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, filename)
    },

})

const upload = multer({ storage: Storage });


router.post('/img',auth, upload.single('avatar'), async function (req, res) {
    try {
        if (req.file == undefined) {
            filename = "";
        } else {
            filename = req.file.filename;
            //const location = req.file.path.split('upload\\') //req.file.path.split('upload/')
            const location = (type == 'DEV' ? req.file.path.split('upload\\') : req.file.path.split('upload/'));
            const url = serverUrl + location[1]
            if(req.body.source=='profile'){
                await models.aboutsubject.findOne({
                    where: {
                        id: req.body.id
                    }
                }).then(data => {
                    if (data) {
                        data.update({
                            photo: url
                        }).then(result => {
                            if (result) {
                                res.status(200).json({
                                    message: 'file uploaded successfully..'
                                })
                            } else {
                                res.json({
                                    status: 400,
                                    message: 'file not uploaded..'
                                })
                            }
                        })
                    }
                })
            }else{
                const updated=await models.course.update({
                    course_picture:url
                },{where:{id:req.body.id}})
                if(updated){
                    res.status(200).json({
                        message: 'file uploaded successfully..'
                    })
                } else {
                    res.json({
                        status: 400,
                        message: 'file not uploaded..'
                    })
            }
           
        }
        }
    } catch (err) {
        console.log('image router error=>', err)
        res.json({
            status: 400,
            message: err.message
        })
    }
})

router.post('/saveAboutSubjectData', auth,async function (req, res) {
    if (req.body.data.tab === "first") {
        models.aboutsubject.findOne({
            where: {
                course_id: req.body.data.id
            }
        }).then(data => {
            if (data) {
                if (req.body.data.selectedImage === true) {
                    const dir = './src/assets/public/upload/course/' + data.id;
                    // console.log(dir)
                    // rimraf(dir, {
                    //     recursive: true
                    // }, (err) => {
                    //     console.log(err)
                    // })
                }
                data.update({
                    TraningFocusArea: req.body.data.focusArea,
                    career_coach_info: req.body.data.career_coach_info,
                    career_overview: req.body.data.career_overview,
                    cost_of_education: req.body.data.cost_of_edu,
                    educational_path: req.body.data.education
                }).then(data => {
                    res.json({
                        status: 200,
                        data: data.id
                    })
                }).catch(err => { console.log(err) })
            } else {
                models.aboutsubject.create({
                    course_id: req.body.data.id,
                    TraningFocusArea: req.body.data.focusArea,
                    career_coach_info: req.body.data.career_coach_info,
                    career_overview: req.body.data.career_overview,
                    cost_of_education: req.body.data.cost_of_edu,
                    educational_path: req.body.data.education
                }).then(data => {
                    if (data) {
                        res.json({
                            status: 200,
                            data: data.id,
                            message: 'The data has been successfully inserted into the aboutsubject table.'
                        })
                    } else {
                        res.json({
                            status: 400,
                            message: 'Data is not inserted.'
                        })
                    }
                })
            }

        }).catch(err => {
            res.json({
                status: 400,
                message: err.message
            })
        })
    } else {
        models.aboutsubject.findOne({
            where: {
                course_id: req.body.data.id
            }
        }).then(data => {
            if (data) {
                data.update({
                    salary: req.body.data.salary,
                    keyTasks: req.body.data.keytask,
                    work_culture: req.body.data.culture,
                    working_hours: req.body.data.hour,
                    places_of_work: req.body.data.place_of_work,
                    More_Info: req.body.data.moreInfo
                }).then(data => {
                    res.json({
                        status: 200,
                        data: data.id
                    })
                }).catch(err => { console.log(err) })
            } else {
                models.aboutsubject.create({
                    course_id: req.body.data.id,
                    salary: req.body.data.salary,
                    keyTasks: req.body.data.keytask,
                    work_culture: req.body.data.culture,
                    working_hours: req.body.data.hour,
                    places_of_work: req.body.data.place_of_work,
                    More_Info: req.body.data.moreInfo
                }).then(data => {
                    if (data) {
                        res.json({
                            status: 200,
                            data: data.id,
                            message: 'The data has been successfully inserted into the aboutsubject table.'
                        })
                    } else {
                        res.json({
                            status: 400,
                            message: 'Data is not inserted.'
                        })
                    }
                })
            }

        }).catch(err => { console.log("&&&&&&&&&&&&&&&&&&&&&", err) })
    }
})

router.get("/getSubjectData",auth, async function (req, res) {
    models.subject.findAll().then(data => {
        res.json({
            data: data
        })
    })
})

router.post('/saveCourseData',auth, async function (req, res) {
    if (req.body.data.cid == undefined) {
        models.course.create({
            name: req.body.data.name,
            subjectID: req.body.data.sub_id
        }).then(data => {
           
            if(data){
                models.aboutsubject.create({
                    course_id:data.id
                }).then(about=>{
                    if(about){
                        res.json({
                            status: 200,
                            data: data.id
                        })
                    }
                })
            }
           

        }).catch(err => {
            res.json({
                status: 400,
                message: err.message
            })
        })
    } else {
        models.course.findOne({
            where: {
                id: req.body.data.cid
            }
        }).then(data => {
            data.update({
                name: req.body.data.name,
                subjectID: req.body.data.sub_id
            }).then(updated => {
                if (updated) {
                    if (req.body.data.selectedPicture === true) {
                        const dir = './src/assets/public/upload/course/coursePicture/' + data.id;
                        // console.log(dir)
                        // rimraf(dir, {
                        //     recursive: true
                        // }, (err) => {
                        //     console.log(err)
                        // })
                    }
                    res.json({
                        status: 200,
                        data: data.id
                    })
                } else {
                    res.json({
                        status: 400,
                        message: 'Data is not updated'
                    })
                }
            })
        })
    }

})

router.post('/saveSubjectData',auth, async function (req, res) {

    models.subject.create({
        sub_name: req.body.data
    }).then(data => {
        // console.log(data)
        res.json({
            status: 200,
            id: data.id
        })
    }).catch(error => {
        // console.log(error.message)
        res.json({
            status: 400,
            message: error.message
        })
    })
})

router.get('/deleteDetails',auth, async function (req, res) {
    // console.log('req.query.course_id===>',req.query.course_id)
    try {
        models.aboutsubject.findOne({
            where: {
                course_id: req.query.course_id
            }
        }).then(result => {
            if (result) {
                models.aboutsubject.destroy({
                    where: {
                        course_id: req.query.course_id
                    }
                }).then(data => {
                    if (result.photo != null && result.photo != "") {
                        const str = result.photo
                        const file = str.split('/').slice(1)
                        var file_location = file[2].split('\\', 4)
                        var file_location = file_location[0] + '/' + file_location[1]
                        //console.log('------------',file_location)
                        const dir = './src/assets/public/upload/' + file_location;
                        // rimraf(dir, (err) => {
                        // })
                    }
                    models.activities.destroy({
                        where: {
                            course_id: req.query.course_id
                        }
                    }).then(act_delete => {
                        //console.log('666666')
                        if (act_delete) {
                            models.course.destroy({
                                where: {
                                    id: req.query.course_id
                                }
                            }).then(result => {
                                res.json({
                                    status: 200,
                                    message: 'data deleted successfully'
                                })
                            })
                        } else {
                            models.course.destroy({
                                where: {
                                    id: req.query.course_id
                                }
                            }).then(result => {
                                res.json({
                                    status: 200,
                                    message: 'data deleted successfully'
                                })
                            })
                        }
                    })

                })
            } else {
                models.activities.destroy({
                    where: {
                        course_id: req.query.course_id
                    }
                }).then(act_delete => {
                    //console.log('666666')
                    if (act_delete) {
                        models.course.destroy({
                            where: {
                                id: req.query.course_id
                            }
                        }).then(result => {
                            res.json({
                                status: 200,
                                message: 'data deleted successfully'
                            })
                        })
                    } else {
                        models.course.destroy({
                            where: {
                                id: req.query.course_id
                            }
                        }).then(result => {
                            res.json({
                                status: 200,
                                message: 'data deleted successfully'
                            })
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log('=====Error on deleteDetails router=====')
    }
})

router.post('/updateSubject', auth,async function (req, res) {
    try {
        models.subject.update({
            sub_name: req.body.data.sub_name
        }, {
            where: {
                id: req.body.data.id
            }
        }).then(data => {
            res.json({
                status: 200,
                data: 'Subject successfully updated.'
            })
        })
    } catch (err) {
        res.json({
            status: 404,
            messgae: 'Data not found .'
        })
    }
})

router.get('/getActivity',auth, async function (req, res) {
    try {
        const aboutActivity = await models.sequelize.query("select * from activities where course_id=" + req.query.course_id, { types: QueryTypes.SELECT })
        res.json({
            data: aboutActivity[0][0]
        })
    } catch (error) { console.log("=====Error on getActivity router:=====\n", error) }

})

router.post('/updateActivity',auth, async (req, res) => {
    //console.log('*****************',req.body.data)
    col = req.body.data.name
    value = req.body.data.value
    try {
        await models.activities.findOne({
            where: {
                course_id: req.body.data.courseID
            }
        }).then(data => {
            if (data) {
                models.activities.update(
                    { [col]: value },
                    {
                        where: {
                            course_id: req.body.data.courseID
                        }
                    }
                ).then(result => {
                    res.json({
                        status: 200,
                        data: result[0]
                    })
                })
            } else {
                //console.log('%%%%%%%%%')
                models.activities.create({
                    course_id: req.body.data.courseID,
                    [col]: value
                }).then(result => {
                    //console.log('^^^^^^^',result)
                    res.json({
                        status: 200,
                        data: result
                    })
                })
            }
        })

    } catch (error) {
        console.log("=====Error on updateActivity router:=====\n", error.message)
    }

})

router.get('/deleteActivityColumn',auth, async function (req, res) {
    //console.log(req.query.id)
    col = req.query.column
    id = req.query.id
    try {
        await models.activities.update(
            { [col]: null },
            {
                where: {
                    course_id: id
                }
            }
        ).then(result => {
            res.json({
                status: 200,
                data: result[0]
            })
        })
    } catch (error) {
        console.log("=====Error on deleteActivityColumn router:=====\n", error.message)
    }
})

//Get Job data according to company and course
router.get('/getCompanyJobData',auth, async function (req, res) {
    console.log("req.query.course_name===>"+req.query.course_name)
    console.log("req.query.company_id===>"+req.query.company_id)
    const companyJobData = await models.sequelize.query("SELECT c.name as company_name, c.overview as company_overview, c.location as company_location, c.city, c.state, c.district, c.logo as company_logo, c.banner as company_banner, cj.title as job_title, cj.description as job_description, cj.overview as job_overview, cj.qualification, cj.salary, cj.location as job_location from company_jobs as cj JOIN companies as c on c.id = cj.company_id WHERE cj.company_courses like '%"+req.query.course_name+"%' and cj.company_id =" + req.query.company_id, { types: QueryTypes.SELECT })
    console.log('companyJobData ',companyJobData)
    res.json({
        data: companyJobData[0][0]
    })
})

module.exports = router;