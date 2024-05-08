const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PlaylistController = require('./PlaylistController');
const requiredLogin = require('../middlewares/requiredLogin');

const playlistApp = express();

playlistApp.use(cors());
playlistApp.use(bodyParser.json());
playlistApp.use(bodyParser.urlencoded({ extended: false }));

playlistApp.get('/api/playlists/', PlaylistController.getPlaylists);
playlistApp.post('/api/playlists/addPlaylist', requiredLogin, PlaylistController.addPlaylist);

playlistApp.get('/api/playlists/:id', PlaylistController.getPlaylistById);
playlistApp.get('/api/playlists/getSong/:playlistId', PlaylistController.getSongsInPlaylist);

module.exports = playlistApp;
