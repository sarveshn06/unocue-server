/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
const jwt = require('jsonwebtoken');
const config = require('config');

const UserService = require('../user/userService');
const cipher = require('./cipherHelper');
const emailService = require('../../backend/sendEmail');

class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  // register(user) {
  //   const { email } = user;
  //   return this.userService.findByEmail(email)
  //     .then(existingUser => {
  //       console.log("3===>1",existingUser);
  //       if (existingUser) {
  //         throw new Error('User already exists');
  //       }
  //       var phone_number = user.phoneCtrl.number
  //       return this.userService.findByMobile(phone_number)
  //         .then(getUserNumber => {
  //           //console.log("3===>2",getUserNumber);
  //           if (getUserNumber) {
  //             throw new Error('This number is already registerd');
  //           }

  //           const { salt, passwordHash } = cipher.saltHashPassword(user.password);
  //           const digits = '1234567899';
  //           let otp = '';
  //           for (let i = 0; i < 6; i++) {
  //             otp += digits[Math.floor(Math.random() * 10)];
  //           }
  //           // console.log("otp===>"+otp);
  //           const newUser = {
  //             email: user?.email,
  //             name: user.fullName,
  //             role: 'user',
  //             age: 18,
  //             salt,
  //             passwordHash,
  //             phone_number_code: user.phoneCtrl?.dialCode,
  //             phone_number: user.phoneCtrl?.number,
  //             lastname: user.lastName,
  //             dob: user.dateOfBirth,
  //             gender: user.genderControl,
  //             otp: otp,
  //             type:user.TypeSchool,
  //             verification_token:user.verification_token,
  //             referral_code: user.codeCtrl
  //           };
  //           //console.log("newUser",newUser)
  //           return this.userService.addUser(newUser);
  //         }).then(respo => {
  //           if (respo) {
  //             //console.log("respo respo respo respo====>"+email);
  //             return this.userService.findByEmail(email);
  //           }
  //         });
  //     })
  //     .then(response => {
  //       if (response) {
  //         return this.userService.findByEmail(email);
  //       }
  //     });
  // }


  async register(user){
      if(user.email!='' && user.email!=null && user.email!=undefined){
        const result=await this.userService.findByEmail(user.email);
        if(result){
          throw new Error('User already exists');
        }
      }
      var phone_number = user.phoneCtrl?.number
      if(phone_number!=null && phone_number!='' && phone_number!=undefined){
        const result=await this.userService.findByMobile(phone_number)
        if(result){
          throw new Error('This number is already registerd');
        }
      }
      const { salt, passwordHash } = cipher.saltHashPassword(user.password);
                const digits = '1234567899';
                let otp = '';
                for (let i = 0; i < 6; i++) {
                  otp += digits[Math.floor(Math.random() * 10)];
                }
                const newUser = {
                  email: user.email?user.email:'',
                  name: user.fullName,
                  role: 'user',
                  age: 18,
                  salt,
                  passwordHash,
                  phone_number_code: user.phoneCtrl?.dialCode?user.phoneCtrl.dialCode:'',
                  phone_number: user.phoneCtrl?.number? user.phoneCtrl.number:'',
                  lastname: user.lastName,
                  dob: user.dateOfBirth,
                  gender: user.genderControl,
                  otp: otp,
                  type:user.TypeSchool,
                  verification_token:user.verification_token,
                  referral_code: user.codeCtrl
                };
        const addedUser = await this.userService.addUser(newUser);
        return addedUser;
  }

  registerAdmin(user) {
    const { email } = user;
    return this.userService.findByEmail(email)
      .then(existingUser => {
        if (existingUser) {
          throw new Error('User already exists');
        }

        const { salt, passwordHash } = cipher.saltHashPassword(user.password);
        const newUser = {
          email: user.email,
          fullName: user.fullName,
          role: 'admin',
          branch: 'default',
          // age: 18,
          salt,
          passwordHash,
        };
        return this.userService.addUser(newUser);
      })
      .then(response => {
        if (response) {
          return this.userService.findByEmail(email);
        }
      });
  }

  resetPassword(password, confirmPassword, userId, resetPasswordToken) {
    let currentUserId = userId;

    if (password.length < 4) {
      return Promise.reject(new Error('Password should be longer than 4 characters'));
    }

    if (password !== confirmPassword) {
      return Promise.reject(new Error('Password and its confirmation do not match.'));
    }

    if (resetPasswordToken) {
      const tokenContent = cipher.decipherResetPasswordToken(resetPasswordToken);
      currentUserId = tokenContent.userId;

      if (new Date().getTime() > tokenContent.valid) {
        return Promise.reject(new Error('Reset password token has expired.'));
      }
    }

    const { salt, passwordHash } = cipher.saltHashPassword(password);

    return this.userService.changePassword(currentUserId, salt, passwordHash);
  }

  refreshToken(token) {
    if (!token.access_token || !token.refresh_token) {
      throw new Error('Invalid token format');
    }

    const tokenContent = jwt.decode(
      token.refresh_token,
      config.get('auth.jwt.refreshTokenSecret'),
      { expiresIn: config.get('auth.jwt.refreshTokenLife') },
    );

    return this.userService.findById(tokenContent.id).then(user => {
      return cipher.generateResponseTokens(user);
    });
  }

  requestPassword(email) {
    return this.userService
      .findByEmailOrPhone(email)
      .then(async user => {
        if (user) {
          const token = cipher.generateResetPasswordToken(user.id);
          const result= await this.userService
          .editUserToken(token,user.id)
          const otp=this.generateOTP();
          if(result){
            user.otp=otp;
            // emailService.callSendgridResetPasswordOTP(email, user.name, user.id,otp);
            emailService.callSendgridSendOTP(user)
            return {otp:otp,id:user.id}
          }   }

        throw new Error('There is no defined email or phone in the system.');
      })
      .catch(error => {
        throw error;
      });
  }

  registerFromApp(user) {
    try {
      const { email } = user;
      this.userService.findByEmail(email).then(existingUser => {
        if (existingUser) return "User already exists"
      })

      var phone_number = user.number
      this.userService.findByMobile(phone_number).then(numberExits => {
        if (numberExits) return "User number already exists"
      })

      const { salt, passwordHash } = cipher.saltHashPassword(user.password);
      const newUser = {
        email: user.email,
        name: user.name,
        role: 'user',
        age: 18,
        salt,
        passwordHash,
        phone_number: user.number,
        email_verified_at:user.verified==true?1:0,
        otp: user.otp,
        referral_code: 'JHI123',
        user_id: user._id
      };
     return this.userService.addUser(newUser)
    }
    catch (e) {
      console.log(e)
    }
    // return this.userService.findByEmail(email).then(existingUser => {
    //     if (existingUser) {
    //       throw new Error('User already exists');
    //     }
    //     var phone_number = user.number
    //     return this.userService.findByMobile(phone_number)
    //       .then(getUserNumber => {
    //         if (getUserNumber) {
    //           throw new Error('This number is already registerd');
    //         }

    //         const { salt, passwordHash } = cipher.saltHashPassword(user.password);
    //         const newUser = {
    //           email: user.email,
    //           name: user.name,
    //           role: 'user',
    //           age: 18,
    //           salt,
    //           passwordHash,
    //           phone_number: user.number,
    //           otp: user.otp,
    //           referral_code:'JHI123',
    //           user_id:user._id
    //         };
    //         //console.log("newUser",newUser)
    //         return this.userService.addUser(newUser);
    //       }).then(respo => {
    //         if (respo) {
    //           //console.log("respo respo respo respo====>"+email);
    //           return this.userService.findByEmail(email);
    //         }
    //       });
    //   })
    //   .then(response => {
    //     if (response) {
    //       return this.userService.findByEmail(email);
    //     }
    //   });
  }

  async verifyBeforeRegisteration(user){
    var Present=true;
    if(user.formData.email){
      const data=await this.userService.findByEmail(user.formData.email)
      if(data){
        return 'User already exists.'
      }else{
        Present=false
      }
    }
    if(user.formData.phone){
      const num=await this.userService.findByMobile(user.formData.phone)
      if(num){
        return 'This number is already registerd'
      }else{
        Present=false
      }
    }
      return Present;
    }
  

  findEmailByID(id){
    return this.userService.findById(id)
  }

generateOTP() {
    const digits = '1234567899';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp.toString()

  }

  checkSubscription(userID){
    return this.userService.companySubscription(userID);
  }


}

module.exports = AuthService;
