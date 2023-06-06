const { resolve } = require('app-root-path');
const request = require('request')
//just for checking
const config=require('config')
const {domain}=config.get('frontEnd')
const {VERIFY_EMAIL_URL,RESET_PASSWORD_URL,BASE_URL_SENDGRID}=config.get('email')

module.exports = {
  callSendgridRouter:(data) => {
      var url=`${domain}${VERIFY_EMAIL_URL}?token=${data.verification_token}&email=${data.email}&type=card2`;
      request.post(BASE_URL_SENDGRID, { form: { userName: data.name, email: data.email,template:'registrationVerification',url:url}}, (error, response, body) => {
        // Printing the error if occurred
        if (error) console.log("error===>", error)
        // Printing status code ==>response.statusCode
        // Printing body==> body
      });
  },
 
  callSendgridResetPasswordOTP:(email, name, id,otp) => {
    //  var  url=`${domain}${RESET_PASSWORD_URL}?reset_password_token=${token}&id=${id}&type=card5`
      request.post(BASE_URL_SENDGRID, { form: { userName: name, email:email,template:'forgotPassword',otp:otp}}, (error, response, body) => {
        // Printing the error if occurred
        if (error) console.log("error===>", error)
        // Printing status code
        // console.log('response', response.statusCode);
        // // Printing body
        // console.log('11111', body);
      });
  },
 
    callSendgridSendOTP:(user)=>{
      // console.log('sendgrid route',`${BASE_URL_SENDGRID}/sendOtp`)
      const formdata={
        userName:user.name,
        email:user.email,
        mobile:user.phone_number,
        mobile_country_code:user.phone_number_code,
        otp:user.otp,
        template: 'email_otp'
      }
      request.post(`${BASE_URL_SENDGRID}sendOtp`, { form:formdata}, (error, response, body) => {
        // Printing the error if occurred
        if (error) console.log("error===>", error)
        // Printing status code
        // console.log('response', response.statusCode);
        // // Printing body
        // console.log('11111', body);
      });
    },

  // callSendgridRouterAttachment: (data) => {
  //   request.post(`${url}attachment`, { form: { userName: data.name, email: data.email, user_id: 1, template: 'welcome', phone: '1234567890', url: data.url } }, (error, response, body) => {
  //     // Printing the error if occurred
  //     if (error) console.log("11111111111111111", error)
  //     // Printing status code
  //     console.log(response.statusCode);
  //     // Printing body
  //     console.log('11111', body);
  //   });
  // 

  TestEmail(email,toEmail){
    console.log(email,toEmail)
    request.post(`${BASE_URL_SENDGRID}testEmail`, { form: {email:email,toEmail:toEmail}},(error, response, body) => {
      // Printing the error if occurred
      if (error) console.log("error===>", error)
      // Printing status code ==>response.statusCode
      // Printing body==> body
      // resolve(response.statusCode)
      console.log('response', response.statusCode);
    });
  },

  mentorNotification(name,session_date,session_time,email){
    request.post(`${BASE_URL_SENDGRID}sendMentorNotification`,{form:{email:email,name:name,session_date:session_date,session_time:session_time,template:'mentorNotification'}},(error, response, body) => {
      if(error) console.log("[-]ERROR ON mentorNotification\n",error)
    })
  }
}

