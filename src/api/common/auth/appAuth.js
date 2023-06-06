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
const { callSendgridRouter, callSendgridSendOTP, callSendgridResetPasswordOTP } = require('../../backend/sendEmail')
const request = require('request');
const { Op, where } = require('sequelize');




// @route : /api/app_auth/login
// @description : login from the app side 
router.post('/login', async (req, res) => {
  // check email 
  let user = await models.users.findOne({ where: { [Op.or]: [{ email: req.body.email }, { phone_number: req.body.email }] }, raw: true })
  if (!user) return res.status(201).json({ status: false, message: "no user with that email" })
  // check password 
  models.users.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { phone_number: req.body.email }]
    }
  }).then(userData => {
    // for verified users
    if (userData.otp_verified_at == 1) {
      passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) { return res.status(201).json({ status: false, message: 'password is incorrect' }) }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          const response = { token: cipher.generateResponseTokens(userData), userId: userData.id, verify: userData.otp_verified_at, username: userData.name, userType: userData.role, email: userData.email, password: userData.passwordHash, referral_code: userData.referral_code };
          res.status(200).json({ status: true, data: response })

        });
      })(req, res);
    } else {
      // non verified user
      passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) { return res.status(201).json({ status: false, message: 'password is incorrect' }) }
        req.login(user, { session: false }, (error) => {

          if (error) {
            res.send(error);
          }
          const response = { userId: userData.id, verify: userData.otp_verified_at, userType: userData.role, email: userData.email, password: userData.passwordHash, referral_code: userData.referral_code };

          res.status(200).json({ status: false, data: response, message: 'please verfiy ' });
          callSendgridSendOTP(userData)

        });
      })(req, res);
    }

  }).catch(err => {
    console.log('[-] Error in @route : /api/app_auth/login method:post')
    console.log(err)
    res.status(500).json({ status: false, message: 'Something went wrong' })
  });

});


// @route : /api/app_auth/VerifyLogin
// @description : Verify after the login if user email is not verified 
router.post('/VerifyLogin', async (req, res) => {
  try {
    let user = await models.users.findOne({ where: { email: req.body.email, otp: req.body.otp }, raw: true })
    if (user) {
      await models.users.update({ otp_verified_at: 1 }, { where: { id: user.id } })
      const response = { token: cipher.generateResponseTokens(user), userId: user.id, verify: 1, username: user.name, userType: user.role, email: user.email, password: user.passwordHash, referral_code: user.referral_code };
      res.status(200).json({ status: true, data: response })
    } else {
      return res.status(200).json({ status: false, message: "incorrect otp" })
    }
  } catch (e) {
    console.log('[-] Error in @route: /api/app_auth/VerifyLogin method:post')
    console.log(e)
    res.status(500).json({ status: false, message: 'Something went wrong' })
  }
})


// @route :/api/app_auth/forgetPassword
// description :forget password
router.post('/forgetpassword', async (req, res) => {
  try {
    let user = await models.users.findOne({ where: { email: req.body.email }, raw: true })
    if (!user) {
      res.status(201).json({ status: false, message: 'no user with that email' })
    } else {
      let otp = authService.generateOTP()
      await models.users.update({ otp: otp }, { where: { id: user.id } })
      let updatedOtp = await models.users.findOne({ where: { id: user.id }, raw: true })
      callSendgridSendOTP(updatedOtp)

      res.status(200).json({ status: true, message: 'verify otp ' })
    }
  } catch (e) {
    console.log('[-] Error in @route: /api/app_auth/forgetpassword method:post')
    console.log(e)
    res.status(500).json({ status: false, message: 'Something went wrong' })
  }
})

router.post('/verifyotp', async (req, res) => {
  try {
    let user = await models.users.findOne({ where: { email: req.body.email, otp: req.body.otp }, raw: true })
    if (!user) {
      res.status(201).json({ status: false, message: 'incorrect otp' })
    } else {
      res.status(200).json({ status: true, message: 'otp verified' })
    }
  } catch (e) {
    console.log('[-] Error in @route: /api/app_auth/verifyotp method:post')
    console.log(e)
    res.status(500).json({ status: false, message: 'Something went wrong' })
  }
})

router.post('/changepassword', async (req, res) => {
  try {
    let user = await models.users.findOne({ where: { email: req.body.email }, raw: true })
    const { salt, passwordHash } = cipher.saltHashPassword(req.body.password);
    let change = await models.users.update({ salt: salt, passwordHash: passwordHash }, { where: { id: user.id } })
    res.status(200).json({ status: true, message: 'password changed sucessfully' })

  } catch (e) {
    console.log('[-] Error in @route: /api/app_auth/changepassword method:post')
    console.log(e)
    res.status(500).json({ status: false, message: 'Something went wrong' })
  }
})

router.post('/register', async (req, res) => {
  try {
    //check alredy register email.
    let userEmail = await models.users.findOne({ where: { email: req.body.email } });
    if (userEmail) return res.status(200).json({ status: false, message: 'This email is already registerd.' });
    //check alredy registerd number
    let userNumber = await models.users.findOne({ where: { phone_number: req.body.number } });
    if (userNumber) return res.status(200).json({ status: false, message: 'This number is already registerd.' });
    //generate opt
    let otp = authService.generateOTP();
    let user = { name: req.body.name, emai: req.body.email, phone_number: req.body.number, phone_number_code: '+91', otp: otp };
    callSendgridSendOTP(user);

    const { salt, passwordHash } = cipher.saltHashPassword(req.body.password);
    //create new user
    await models.users.create({ name: req.body.name, lastname: req.body.lastName, dob: req.body.dob, gender: req.body.gender, email: req.body.email, role: 'user', passwordHash: passwordHash, salt: salt, phone_number: req.body.number, otp: otp });
    let newUser = await models.users.findOne({ where: { [Op.or]: [{ email: req.body.email }, { phone_number: req.body.email }] }, raw: true });
    if (newUser) {
      res.status(200).json({ status: true, message: 'Successfully Registerd!!', data: newUser });
    }

  } catch (e) {
    console.log(`[-] Error in @route: /api/app_auth/register method:post `, e);
    res.status(500).json({ status: false, message: 'Something went wrong' });
  }

})

module.exports = router;