const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SongController = require('./SongController');
const requiredLogin = require('../middlewares/requiredLogin');

const songApp = express();

songApp.use(cors());
songApp.use(bodyParser.json());
songApp.use(bodyParser.urlencoded({ extended: false }));

songApp.get('/api/songs/', SongController.getSongs);
songApp.post('/api/songs/addsong', requiredLogin, SongController.addSong);
songApp.get('/api/songs/search', SongController.search);
songApp.get('/api/songs/:id', SongController.getSongById);

module.exports = songApp;
