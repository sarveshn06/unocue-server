/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const passport = require('passport');

const cipher = require('../auth/cipherHelper');
const AuthService = require('./authService');

const router = express.Router();
const authService = new AuthService();
const auth = passport.authenticate('jwt', { session: false });

var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');

const multer = require('multer');
var fs = require('fs');
const config = require('config');
const { serverUrl } = config.get('api');
const { BASE_URL_APP } = config.get('api');
const { type } = config.get('api'); 
const {callSendgridRouter, callSendgridSendOTP,callSendgridResetPasswordOTP}=require('../../backend/sendEmail')
const request = require('request');
const {Op}=require('sequelize')

// router.post('/login', (req, res) => {
//   passport.authenticate('local', { session: false }, (err, user) => {
//     console.log("user==>1===>"+JSON.stringify(user))
//     if (err || !user) {
//       return res.status(401).send({
//         error: err ? err.message : 'Login or password is wrong',
//       });
//     }
//     req.login(user, { session: false }, (error) => {
//       if (error) {
//         res.send(error);
//       }

//       const response = { token: cipher.generateResponseTokens(user) };
//       console.log("JSON.stringify(response)=====>"+JSON.stringify(response));
//       res.send(response);
//     });
//   })(req, res);
// });


router.post('/login', (req, res) => {
  models.users.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { phone_number: req.body.email }]
    }
  }).then(userData => {
    // console.log('userData',userData)
    if (userData.otp_verified_at == 1 && userData.active_status == 1) {
        passport.authenticate('local', { session: false }, (err, user) => {
          if (err || !user) {
            return res.status(401).send({
              error: err ? err.message : 'Login or password is wrong',
            });
          }
          user.email = req.body.email;
          req.login(user, { session: false }, (error) => {
            if (error) {
              res.send(error);
            }
            models.users.findOne({
              where: {
                [Op.or]: [{ email: req.body.email }, { phone_number: req.body.email }]
              }
            }).then(async function (user) {
              models.companies.findOne({
                where: {
                  user_id: user.id
                }
              }).then(companies => {
                user.company_id = companies ? companies.id : ''
              })
              if (user.role == 'company') {
                const result = await authService.checkSubscription(user.id)
                if (result) {
                  const response = { token: cipher.generateResponseTokens(user) };
                  res.send(response);
                } else {
                  res.status(401).send({ error: "Expired" })
                }
              } else {
                const response = { token: cipher.generateResponseTokens(user),userId:user.id,username:user.name,userType:user.role,email:user.email,password:user.passwordHash,referral_code:user.referral_code};
                //console.log("response@@",response)
                res.send(response);
              }
            });
          });
        })(req, res);
    } else {
      if (userData.active_status == 0 && userData.otp_verified_at == 1 && userData.role != 'user') {
        res.status(401).send({ error: "You are not Verified User." })
      } else {
        res.status(401).send({ error: "Mobile Number is not Verified." })
      }

    }

  }).catch(err => {
    res.status(400).send({ error: err.message })
  });

});

router.post('/sign-up', (req, res) => {
  var refer_id = '#7275b5'; //req.body.refer_id//
  req.body['verification_token']=cipher.genRandomString(7)
  // console.log("req.body===>"+JSON.stringify(req.body));
  authService
    .register(req.body)
    .then(user => {
      if(user){
        const response = { token: cipher.generateResponseTokens(user) };
        callSendgridSendOTP(user)
        res.send(response);
      }else{
        res.json({
          status : 400,
          message : 'Error coming while registering.'
        })
      }
    })
    .catch(err => {
      res.status(400).send({ error: err.message })
    });
});

router.post('/reset-pass', (req, res) => {
  const { password, confirmPassword, id,resetPasswordToken } = req.body;
  authService
    .resetPassword(password, confirmPassword, id, resetPasswordToken)
    .then(async (data) => {
    //  const result=await authService.findEmailByID(id);
    //  console.log('result',result.email,password)
    res.send({ message: 'ok' })
    //  request.post(BASE_URL_APP + 'auth/changepassword',{
    //   json:{
    //     email:result.email,
    //     password:password
    //   }
    //  }, function (error, respo, body){
    //   if(respo!=undefined){
    //     if(body.status==true){
    //       res.send({ message: 'ok' })
    //     }else if (body.status == 400 || body.status == 500) {
    //       //console.log("respo inside 400===>");
    //         res.json({
    //           status : 400,
    //           message : body.message
    //         })
    //     }else{
    //       res.json({
    //         status : 400,
    //         message : 'not getting response from api.'
    //       })
    //     }
    //   }else{
    //     res.json({
    //       status : 400,
    //       message : 'Error coming while changing password.'
    //     })
    //   }
    //  })
      
    }

    // 
   )
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
});

router.post('/request-pass',async (req, res) => {
  const { email } = req.body;
  authService
    .requestPassword(email)
    .then(async(data) => {
      const result= await models.users.update({otp:data.otp},{where:{ [Op.or]: [{email:email}, {phone_number:email}]}})
      res.send({type:'card5',id:data.id })
    }).catch((error) => {
      res.status(400).send({ data: { errors: error.message } });
    });
});

router.post('/sign-out', (req, res) => {
  res.send({ message: 'ok' });
});

router.post('/refresh-token', (req, res) => {
  const token = req.body;
  authService
    .refreshToken(token.payload)
    .then(responseToken => res.send({ token: responseToken }))
    .catch(err => res.status(400).send({ error: err.message }));
});



var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
      var dir ='./src/assets/public/upload/user/' + req.user.id;
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
      const filename =Date.now()+"_"+file.originalname.toLowerCase().split(' ').join('-')
      cb(null, filename)
  }
})

const upload = multer({storage: Storage});

router.post('/img', auth, upload.single('avatar'), async (req, res) => {
  try {
    var previousFile;
    if (req.file == undefined) {
      filename = "";
    } else {
      filename = req.file.filename;
      const location = (type == 'DEV' ? req.file.path.split('upload\\') : req.file.path.split('upload/'));
      const url = serverUrl + location[1]
      await models.users.findOne({
        where: {
          id: req.user.id
        }
      }).then(data => {
        if (data) {
          previousFile = data.photo;
          data.update({
            photo: url
          }).then(result => {
            if (result) {
              const preFilename = (type == 'DEV' ? previousFile.split(req.user.id + '\\') : previousFile.split(req.user.id + '/'));
              const directory = './src/assets/public/upload/user/' + req.user.id;
              fs.readdir(directory, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                  if (file == preFilename[1]) {
                    fs.unlink(path.join(directory, file), err => {
                      if (err) throw err;
                    });
                  }
                }
              });
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
    }
  } catch (err) {
    res.json({
      status: 400,
      message: err.message
    })
  }
})

// @route : /addUser
// description : to seed data from levelnext server
router.post('/addUser',(req,res)=>{
  try{
    const user = authService.registerFromApp(req.body)
    user.then(data1=>{res.status(200).json({status:true,data:data1})})
  }catch(e){
    console.log('[-] Error in  @route :/addUser')
    console.log(e)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  }
})

// to check email/number is already present or not
router.post('/verifyUser',async function(req,res){
try{

  const result=await authService.verifyBeforeRegisteration(req.body)
  if(result==false){
    res.json({status:false})
  }else{
    res.status(200).json({status:true,message:result})
  }
}catch(e){
  console.log('[-] Error in  @route :/verifyUser')
  console.log(e)
  res.status(500).json({status:false,message:'Something Went Wrong'})
}
})

//used to verify email verification token
router.get('/verifyEmail',(req,res)=>{
  models.users.findOne({
    where:{
      email:req.query.email
    }
  }).then(data=>{
    if(data.verification_token === req.query.token){
      if(data.email_verified_at === 1){
        res.json({
          status:200,
          data:'already'//"You have already verified your email. Now you can proceed for login.."
        })
       
      }else{
        data.update({
          email_verified_at:1
        }).then(data=>{
          if(data){
            res.json({
              status:200,
              data:true//"You have successfully verified your email. Now you can proceed for login.."
            })
          }
        }) 
      }  
    }else{
      res.json({
        status:401,
        data:'false'//'Email is not verified'
      })
    }
  }).catch(error=>{
    console.log('[-] Error in  @route :verifyEmail\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  })

})

//to send otp to user
router.get('/getVerificationOtp',async (req,res)=>{
  try{
    const user=await models.users.findOne({where:{ [Op.or]: [{email:req.query.data}, {phone_number: req.query.data}]}})
      if(user){
      const newOTP=authService.generateOTP()
      if(newOTP){
        const updatedOTP=await models.users.update({otp:newOTP},{where:{ [Op.or]: [{email:req.query.data}, {phone_number: req.query.data}]}})
        if(updatedOTP){
          user.otp=newOTP
          callSendgridSendOTP(user)
          // res.status(200).json({data:newOTP,email:req.query.data})
          res.status(200).json({status:true})
        }
       
      }    
    }else{
      res.json({
        status:400,message:'User not found.'
      })
    }
  }catch(error){
    console.log('[-] Error in  @route :/getVerificationOtp\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  }
})

// update user as verified
router.post('/verifyOtp', (req, res) => {
  models.users.findOne({
    where: {
      [Op.or]: [{email:req.body.data}, {phone_number: req.body.data}]
    }
  }).then(data => {
    if (data) {
        if(data.otp == req.body.otp){
          data.update({
            otp_verified_at: 1,
            active_status:1
          }).then(data => {
            if (data) {
              res.status(200).json({
                data: true//"You have successfully verified your email. Now you can proceed for login.."
              })
            }
          })
        }else{
          res.json({data:false})
        }
           
    }
  }).catch(error => {
    console.log('[-] Error in  @route :verifyOtp\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  })

})

//check user is verified or not by otp
router.get('/findverifyOtp',async(req,res)=>{

  models.users.findOne({where:{email:req.query.email}}).then(found=>{
    if(found){
      if(found.otp_verified_at==1){
        res.json({status:200,data:true})
      }else{
        res.json({status:200,data:false})
      }
    }else{
      res.json({status:404,message:'User not found'})
    }
  }).catch(error=>{
    console.log('[-] Error in  @route :/findverifyOtp\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  })
})

// to send verification email to user
router.get('/resendEmail',(req,res)=>{
  var val=cipher.genRandomString(7)
  models.users.findOne({
    where:{
      email:req.query.email
    }
  }).then(async emailFound =>{
    if(emailFound){
      emailFound.update({
        verification_token:val
      }).then(updatedEmail=>{
        if (updatedEmail) {
          callSendgridRouter(emailFound)
            res.json({
              status: 200
            })
        }else{
          res.json({status:400,message:'Verification token not updated..'})
        }
      })
    }else{
      res.json({
        status:404,message:'User not found.'
      })
    }
  }).catch(error=>{
    console.log('[-] Error in  @route :resendEmail\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  })
})

//send otp for forgot password
router.get('/resendForgotOtp',async(req,res)=>{
  try{
    const result=await models.users.findOne({where:{[Op.or]: [{email:req.query.email}, {phone_number:req.query.email}]}})
    if(result){
      const otp= authService.generateOTP();
      const upadtedata=await models.users.update({otp:otp},{where:{[Op.or]: [{email:req.query.email}, {phone_number:req.query.email}]}})
      result.otp=otp
      callSendgridSendOTP(result)
      res.status(200).json({status:true})
    }
  }catch(error){
    console.log('[-] Error in  @route :/resendForgotOtp\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  }
  
})

router.get('/verifyForgotOtp',async(req,res)=>{
  try{
    const result=await models.users.findOne({where:{[Op.or]: [{email:req.query.email}, {phone_number:req.query.email}],otp:req.query.otp}})
    if(result){
      res.status(200).json({status:true})
    }else{
      res.status(200).json({status:false})
    }
  }catch(error){
    console.log('[-] Error in  @route :/verifyForgotOtp\n',error)
    res.status(500).json({status:false,message:'Something Went Wrong'})
  }
  
})



module.exports = router;