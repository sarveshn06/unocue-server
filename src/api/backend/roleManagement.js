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
const { serverUrl } = config.get('api');
const cipher = require('../common/auth/cipherHelper')
const AuthService = require('../common/auth/authService')
const functions = new AuthService();
const { QueryTypes } = require('sequelize');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

router.get('/getMenuRole', function (req, res) {
    var roles = [];
    if(req.query.role !=undefined || req.query.role != null){
    if (req.query.role != 'user') {
        models.roles.findOne({
            where: {
                user_id: req.query.userId
            }
        }).then(function (data) {
            if (data) {
                if (data.Dashboard) {
                    roles.push('Dashboard');
                }
                if (data.Applications) {
                    roles.push('Applications');
                }
                if (data.Role_Management) {
                    roles.push('Role Management');
                }
                if (data.Work_Experiment_Programs) {
                    roles.push('Work Experiment Programs');
                }
                if (data.Program_Approval) {
                    roles.push('Program Approval');
                }
                if (data.Program_Management) {
                    roles.push('Program Management');
                }
                if (data.Workshop_Management) {
                    roles.push('Workshop Management');
                }
                if (data.Reports) {
                    roles.push('Reports');
                }
                if (data.Course_Management) {
                    roles.push('Course Management');
                }
                if (data.Meeting_Management) {
                    roles.push('Zoom meeting Management');
                }
                if (data.Jobs) {
                    roles.push('Jobs');
                }
                if (data.Mentor) {
                    roles.push('Mentors');
                }if (data.Workshops) {
                    roles.push('Workshops');
                }if (data.Blogs) {
                    roles.push('Blogs');
                }

                res.json({
                    status: 200,
                    data: roles
                })
            } else {
                res.json({
                    status: 400
                })
            }
        })
    } else {
        models.roles.findOne({
            where: {
                name: req.query.role
            }
        }).then(function (data) {
            if (data) {
                if (data.Dashboard) {
                    roles.push('Dashboard');
                }
                if (data.Applications) {
                    roles.push('Applications');
                }
                if (data.Role_Management) {
                    roles.push('Role Management');
                }
                if (data.Work_Experiment_Programs) {
                    roles.push('Work Experiment Programs');
                }
                if (data.Program_Approval) {
                    roles.push('Program Approval');
                }
                if (data.Program_Management) {
                    roles.push('Program Management');
                }
                if (data.Workshop_Management) {
                    roles.push('Workshop Management');
                }
                if (data.Reports) {
                    roles.push('Reports');
                }
                if (data.Course_Management) {
                    roles.push('Course Management');
                }
                if (data.Meeting_Management) {
                    roles.push('Zoom meeting Management');
                }
                if (data.Jobs) {
                    roles.push('Jobs');
                }
                if (data.Mentor) {
                    roles.push('Mentors');
                }if (data.Workshops) {
                    roles.push('Workshops');
                }if (data.Blogs) {
                    roles.push('Blogs');
                }

                res.json({
                    status: 200,
                    data: roles
                })
            } else {
                res.json({
                    status: 400
                })
            }
        })
    }
}
})

//@author:Mamta - to get user's data by joining users and roles table where role is not user
router.get('/getRolesData',auth,async (req, res) => {
    try {
        const rollData = await models.sequelize.query("SELECT u.id as USER,u.NAME,u.lastname,u.email,u.phone_number,u.gender,u.role ,u.active_status,r.* FROM users AS u LEFT JOIN roles AS r ON u.id = r.user_id WHERE u.role != 'user';", { types: QueryTypes.SELECT })
        if (rollData) {
            res.json({
                status: 200,
                data: rollData[0]
            })
        }
    } catch (e) {
        res.json({
            status: 400,
            error: e
        })
        //Send Failure Response
    }
})

router.get('/editRolesData',auth, function (req, res) {
    var view_data = {};
    models.roles.findOne({
        where: {
            user_id: req.query.userId
        }
    }).then(function (roles) {
        //console.log("editRolesData ",JSON.stringify(roles))
        if (roles) {
            view_data.name = roles.name;
            view_data.Dashboard = roles.Dashboard;
            view_data.Applications = roles.Applications;
            view_data.Role_Management = roles.Role_Management;
            view_data.Work_Experiment_Programs = roles.Work_Experiment_Programs;
            view_data.Program_Management = roles.Program_Management;
            view_data.Program_Approval = roles.Program_Approval;
            view_data.Workshop_Management = roles.Workshop_Management;
            view_data.Course_Management = roles.Course_Management;
            view_data.Meeting_Management = roles.Meeting_Management;
            view_data.Reports = roles.Reports;
            view_data.Jobs = roles.Jobs;
            view_data.Mentor = roles.Mentor;
            view_data.Workshops = roles.Workshops;
            view_data.Blogs = roles.Blogs;

            res.json({
                status: 200,
                data: view_data
            })

        } else {
            res.json({
                status: 400
            })
        }
    })
})

router.post('/createNewUserRole', auth,(req, res) => {
    var data = req.body;
    if (req.body.userId != null) {
        models.users.findOne({
            where: {
                id: req.body.userId
            }
        }).then(function (user) {
            user.update({
                name: data.firstNameCtrl,
                lastname: data.lastNameCtrl,
                email: data.emailCtrl,
                phone_number: data.phoneCtrl,
                gender: data.genderCtrl
            }).then(function (updatedUser) {
                var response = {
                    status: 'edit',
                    id: updatedUser.id
                }
                res.json({
                    status: 200,
                    data: response
                })
            })
        })
    } else {
        var password = "P@ssw0rd";
        var { salt, passwordHash } = cipher.saltHashPassword(password)
        var otp = functions.generateOTP();
        models.users.create({
            name: data.firstNameCtrl,
            lastname: data.lastNameCtrl,
            email: data.emailCtrl,
            phone_number: data.phoneCtrl,
            gender: data.genderCtrl,
            salt: salt,
            passwordHash: passwordHash,
            role: 'sub_admin',
            otp: otp,
            otp_verified_at: 1,
            email_verified_at: 0,
            active_status:false
        }).then(function (user) {
            var response = {
                status: 'add',
                id: user.id
            }
            res.json({
                status: 200,
                data: response
            })
        })
    }
})

router.post('/setUpdateRole', auth,(req, res) => {
    models.roles.findOne({
        where: {
            user_id: req.body.userId
        }
    }).then(role => {
        if (role) {
            var insert_obj = {
                Dashboard: 0,
                Applications: 0,
                Role_Management: 0,
                Work_Experiment_Programs: 0,
                Program_Management: 0,
                Workshop_Management: 0,
                Course_Management: 0,
                Meeting_Management: 0,
                Reports: 0,
                Jobs: 0,
                Mentor: 0,
                Program_Approval:0,
                Blogs:0,
            };

            if (req.body.roles.length > 0) {
                req.body.roles.forEach(function (role) {
                    insert_obj[role] = 1;
                });
            }
            role.update(insert_obj).then(function (updated_roles) {
                if (updated_roles) {
                    updated_roles.update({
                        name: req.body.roleName
                    }).then(updatedData => {
                        res.json({
                            status: 200,
                            data: updatedData
                        });
                    })
                } else {
                    res.json({
                        status: 400,
                        message: "Error occured while updating roles."
                    });
                }
            });
        } else {
            var insert_obj = {
                user_id: req.body.userId,
                name: req.body.roleName
            };

            if (req.body.roles) {
                if (req.body.roles.length > 0) {
                    req.body.roles.forEach(function (role) {
                        insert_obj[role] = 1;
                    });
                }
            }

            models.roles.create(insert_obj).then(function (roles_created) {
                if (roles_created) {
                    res.json({
                        status: 200,
                        data: roles_created
                    })
                } else {
                    res.json({
                        status: 400,
                        message: "Error occured while creating roles."
                    })
                }
            })
        }
    }).catch(error => {
        console.log('[-] Error in @route /setUpdateRole method:post\n', e)
        res.status(500).json({ status: false, message: 'Something went wrong' })
    })
})

router.get('/deleteRole',auth,(req, res) => {
    models.roles.destroy({
        where: {
            id: req.query.id
        }
    }).then(data => {
        if (data) {
            res.json({
                status: 200,
                data: true
            })
        }
    }).catch(error => {
        console.log('=====Error on deleteRole router=====\n', error)
    })
})

//@author:mamta - to get user from user table by pasing id
router.get('/getUser',auth, (req, res) => {
    models.users.findOne({ where: { id: req.query.id }, attributes: ['id', 'name', 'lastname', 'email', 'gender', 'role', 'phone_number'] })
        .then(result => {
            if (result) {
                res.json({ status: 200, data: result })
            }
        }).catch(error => {
            console.log('[-] Error in @route /getUser method:get\n', error)
            res.status(500).json({ status: false, message: 'Somthing went wrong' })
        })
})

//@author:mamta - to change active status of user by passing user id and active status value
router.post('/changeActiveStatus',auth,(req, res) => {
    models.users.update({ active_status: req.body.isActive }, { where: { id: req.query.user_id } })
        .then(result => {
            if (result) {
                res.json({
                    status: 200
                })
            }
        }).catch(error => {
            console.log('[-] Error in @route /changeActiveStatus method:post\n', error)
            res.status(500).json({ status: 500, message: 'Somthing went wrong' })
        })
})
module.exports = router;