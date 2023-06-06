/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const UserService = require('./common/user/userService');
const cipher = require('./common/auth/cipherHelper');
const logger = require('../utils/logger');
const AuthService = require('../api/common/auth/authService');
const authService = new AuthService();
var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');

class SeedService {
  checkAndSeed() {
    logger.info('Seed Data')

    let users = models.users.findAll({}).then( data => {
  
     // console.log("data",data.length)
      if(data.length == 0){
        this.seeding().then();
      }
    });
}
 
async seeding() {
  try {
    logger.info('Seed Data');
    const newUser = {
      email: 'admin@edulab.in',
      fullName: 'Administrator',
      role: 'admin',
      branch:'default',
      password: 'edulab123'
      //salt: hash.salt,
      //passwordHash: hash.passwordHash,
    };

    await authService.registerAdmin(newUser);

//      await this.addCustomUsers();
    logger.info('Seed Users Done');
  } catch (err) {
    logger.error(err);
  }
}

  
}

module.exports = SeedService;
