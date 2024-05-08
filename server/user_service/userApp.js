const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const UsersController = require('./UserController');
const multer = require('multer');
const upload = multer();
const requireLogin = require('../middlewares/requiredLogin')
const jwtAuthMiddleware = require('../middlewares/requiredLogin')
const userApp = express();

userApp.use(cors());
userApp.use(bodyParser.json());
userApp.use(bodyParser.urlencoded({ extended: false }));


userApp.post('/api/users/register', UsersController.register);
userApp.get('/api/users/', requireLogin,  UsersController.getProfile);
userApp.patch('/api/users/', requireLogin, upload.single("file"), UsersController.updateProfile);
userApp.post('/api/users/change-password', requireLogin, UsersController.changePassword);

userApp.get('/api/users/getSongs', jwtAuthMiddleware, UsersController.getLikedSongs);
userApp.get('/api/users/checkSong/:songId', jwtAuthMiddleware, UsersController.checkSongExist);


userApp.post('/api/users/addLikedSong/:songId', jwtAuthMiddleware, UsersController.addLikeSong);
userApp.delete('/api/users/unlikeSong/:songId', jwtAuthMiddleware, UsersController.unlikeSong);

userApp.post('/api/users/activatePremium', requireLogin, UsersController.activatePremium30Days);

module.exports = userApp;
