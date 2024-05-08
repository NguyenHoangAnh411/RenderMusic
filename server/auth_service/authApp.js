const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthController = require('./AuthController');
const requireLogin = require('../middlewares/requiredLogin')
const authApp = express();

// Sử dụng middleware
authApp.use(cors());
authApp.use(bodyParser.json());
authApp.use(bodyParser.urlencoded({ extended: false }));

// Định nghĩa các tuyến đường liên quan đến xác thực
authApp.post('/api/auth/login', AuthController.login);
authApp.post('/api/auth/resend', AuthController.sendEmailForgetPassword);
authApp.post('/api/auth/direct', AuthController.directLogin);
module.exports = authApp;
