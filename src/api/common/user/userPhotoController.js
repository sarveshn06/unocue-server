/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const path = require('path');
var root_path = path.dirname(require.main.filename);
const UserService = require('./userService');

const router = express.Router();
const userService = new UserService();

router.get('/', (req, res) => {
  userService
    .getPhoto(req.query.token)
    .then(photo => {
      const filePath = path.join(root_path, `/assets/${photo}`);
      res.sendFile(filePath);
    }).catch((error) => {
      res.status(400).send({ error: error.message });
    });
});

module.exports = router;
