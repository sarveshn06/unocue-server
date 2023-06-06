const express = require('express');
const router = express.Router();
var path = require('path');
var root_path = path.dirname(require.main.filename);
console.log(root_path);
//var models = require(root_path + '/models');
const models = require( '../../models/index');
var moment = require("moment");
const multer = require('multer');
var fs = require('fs');
const request = require('request');
const UserService = require('./../common/user/userService');
const userService = new UserService();

const cipher = require('./../common/auth/cipherHelper');
const defult = require('./../../../config/default');
const config = require('config');
const { serverUrl } = config.get('api');
const { type } = config.get('api'); 
var functions = require(root_path+'/utils/function');
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

//import fetch from 'node-fetch';
const fetch = require('node-fetch');

//CROP IMAGE START//
const base64Img = require('base64-img');
//CROP IMAGE END//

var copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
    //  fs.mkdirSync(dest);
      fs.readdirSync(src).forEach(function(childItemName) {
        
        copyRecursiveSync(path.join(src, childItemName),path.join(dest, childItemName));
        var deleteFile = path.join(src,childItemName)
        //console.log(deleteFile)
        fs.unlinkSync(deleteFile);                  
      });
   
    } else {
      fs.copyFileSync(src, dest);
    }
  };

// Multer File upload settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir;
        if(req.body.type == 'logo'){
            dir = './src/assets/public/upload/company/' + req.body.id+'/logo';
        }else if(req.body.type == 'banner'){
            dir = './src/assets/public/upload/company/' + req.body.id+'/banner';
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
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
            file.mimetype == 'application/pdf' ||
            file.mimetype == 'application/x-pdf'|| 
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png'
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Only .pdf, .jpeg, .jpg, .png format allowed!'))
        }
    },
})

router.post('/companyRegister', (req, res) => {
    var formData = req.body.formData;
    // console.log("companyRegister companyRegister companyRegister")
    // console.log("JSON.stringify(req.body.formData)====>"+JSON.stringify(req.body.formData));

    userService.findByEmail(formData.emailAddress).then(existingUser => {
        if (existingUser) {
            //console.log("1")
            res.json({
                status:400,
                message : 'User already exists'
            })
        }else{
            const { salt, passwordHash } = cipher.saltHashPassword(formData.password);
            const newUser = {
                name: formData.name,
                email: formData.emailAddress,
                fullName: formData.name,
                role: 'company',
                salt,
                passwordHash,
                phone_number_code: formData.phoneCountryCode,
                phone_number: formData.phoneMobileNo,
                otp_verified_at: true,
                active_status:false
            };
            //console.log("newUser",newUser)
            userService.addUser(newUser).then(response => {
                if (response) {
                    //console.log("2")
                    models.companies.create({
                        name : formData.name,
                        overview : formData.description,
                        location : formData.address,
                        state : formData.state,
                        city : formData.city,
                        district : formData.district,
                        logo : null,
                        type_of_institute : formData.typeCompany,
                        status : 'approved',
                        institute_status : 'active',
                        established_in : formData.established,
                        email : formData.emailAddress,
                        contact_number_code : formData.phoneCountryCode,
                        contact_number : formData.phoneMobileNo,
                        registered_date : moment(new Date(functions.get_current_datetime())).format("YYYY-MM-DD"),//formData.established,
                        alternate_email : formData.alternateEmailAddress,
                        subscription_partnership : false,
                        user_id : response.id
                    }).then(function(comanycreated){
                        //console.log("3")
                        if(comanycreated){
                            //console.log("4")
                            var dir = './src/assets/public/upload/company/' + comanycreated.id;
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                                var dir1 = './src/assets/public/upload/company/' + comanycreated.id+'/gallery';
                                if (!fs.existsSync(dir1)) {
                                    fs.mkdirSync(dir1);}
                                var dir2 = './src/assets/public/upload/company/' + comanycreated.id+'/workshop';
                                    if (!fs.existsSync(dir2)) {
                                        fs.mkdirSync(dir2);}
                                var dir3 = './src/assets/public/upload/company/' + comanycreated.id+'/programs';
                                    if (!fs.existsSync(dir3)) {
                                        fs.mkdirSync(dir3);}
                                        var dir4 = './src/assets/public/upload/company/' + comanycreated.id+'/task';
                                        if (!fs.existsSync(dir4)) {
                                            fs.mkdirSync(dir4);}
                            }

                            var startDate = comanycreated.createdAt.toISOString().split('T')[0]
                            //for free subscription duration 12 months
                            const expireDate=userService.Addsubscription(startDate,12)

                            models.Company_Subscription.create({
                                user_id:response.id,
                                start_date:startDate,
                                end_date: expireDate,
                                recurring:'no',
                                status: 'active',
                                subscription_id:2
                            }).then(data=>{
                                if(data){
                                    userService.findByEmail(formData.emailAddress).then(function(){
                                        res.json({
                                            status : 200,
                                            data : comanycreated.id
                                        })
                                    })
                                }
                            })

                        }else{
                            //console.log("5")
                            res.json({
                                status : 400,
                                message : "Error while creating the company"
                            })
                        }
                    })
                }else{
                    res.json({
                        status : 400,
                        message : "Error while registration"
                    })
                }
            });
        }
    })
})
  
router.post('/upload', upload.single('avatar'), (req, res, next) => {

    var id = req.body.id;
    if(req.file == undefined){
        res.status(201).json({
            message: 'No changes to file!',
           })
    }else{
        //console.log("req.file.path====>"+req.file.path);
        var minusPublic = (type=='DEV' ? req.file.path.split('upload\\') : req.file.path.split('upload/'));
        var url = serverUrl + minusPublic[1];
        var url1 = url.split(/\\/g).join('/');
        var condition;
        if(req.body.type == 'logo'){
            condition = {
                logo: url1
            }
        }else if(req.body.type == 'banner'){
            condition = {
                banner: url1
            }
        }
        

        models.companies.update(condition, {
            where: {
                id: id
            }
        }).then(function (data) {
            res.status(200).json({
                message: 'file upload successfully!',
                //  avatar: url + '/public/' + req.file.filename,
            })
        })
    }
})

router.get('/getCompanyDetails',auth,async function(req,res){
    try{
        const result=await models.companies.findOne({where:{user_id:req.query.user_id}})
        if(result){
            res.status(200).json({result})
        }else{
            res.status(400);
        }

    }catch(error){
        console.log('=====ERROR ON getCompanyDetails ROUTES=====\n',error)
        res.status(500).json({message:error.message})
    }
})

router.put('/updateCompany',auth,async function(req,res){
    console.log('req==>',req.body)
    try{
        const result=await models.companies.findOne({where:{user_id:req.query.user_id}})
        if(result){
            const updatedData=await result.update(req.body)
            if(updatedData){
                // if(req.body.logoSelected===true){
                //     const str=updatedData.logo
                //     const file=str.split('/').slice(3)
                //     const dir = './src/assets/public/upload/' + file[0]+'/'+file[1]+'/'+file[2]+'/'+file[3]
                //         fs.unlink(dir,(err)=>{
                //             //console.log(err)
                //         })
                // }
                // if(req.body.bannerSelected===true){
                //     const str=updatedData.banner
                //     const file=str.split('/').slice(3)
                //     const dir = './src/assets/public/upload/' + file[0]+'/'+file[1]+'/'+file[2]+'/'+file[3]
                //         fs.unlink(dir,(err)=>{
                //             //console.log(err)s
                //         })
                // }
                res.status(200).json(updatedData)
            }else{
                res.status(400)
            }
        }
    }catch(error){
        console.log('=====ERROR ON updateCompany ROUTER====\n',error);
        res.status(500).json({message:error.message})
    }
})

//Auther Shweta Vaidya
// Api call for one server to another ( instread of request library use this code)
router.get('/test_node_fetch',async function(req,res){
    console.log("coming here");
    // fetch('https://jsonplaceholder.typicode.com/users')
    fetch('http://localhost:5000/')
    .then(res => res.json())
    .then(json => {
        console.log("First user in the array:");
        // console.log(json[0]);
        // console.log("Name of the first user in the array:");
        // console.log(json[0].name);
    })

})


//Auther Shweta Vaidya
//Upload cropped image RND
router.post('/uploadData', (req, res) => {
    //console.log("req.body.croppedImage====>"+req.body.croppedImage);
    var image = req.body.croppedImage;
    base64Img.img(image, './server/public', Date.now(), function(err, filepath){
        const pathArr = filepath.split('/');
        console.log("pathArr====>"+pathArr)
        const fileName = pathArr[pathArr.length - 1];
        console.log("fileName====>"+fileName)
    });

})

module.exports = router;