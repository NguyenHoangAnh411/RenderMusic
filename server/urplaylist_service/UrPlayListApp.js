const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const UrPlaylistController = require('./UrPlaylistController');
const jwtAuthMiddleware = require('../middlewares/requiredLogin');

const urPlaylistApp = express();

urPlaylistApp.use(cors());
urPlaylistApp.use(bodyParser.json());
urPlaylistApp.use(bodyParser.urlencoded({ extended: false }));

urPlaylistApp.get('/api/yourplaylists/', jwtAuthMiddleware, UrPlaylistController.getPlaylist);
urPlaylistApp.get('/api/yourplaylists/search/', UrPlaylistController.search);
urPlaylistApp.post('/api/yourplaylists/add', jwtAuthMiddleware, UrPlaylistController.addYourPlaylist);
urPlaylistApp.get('/api/yourplaylists/:urplaylistId', UrPlaylistController.getUrPlaylistById);
urPlaylistApp.get('/api/yourplaylists/getSong/:urplaylistId', UrPlaylistController.getSongsInUrPlaylist);
urPlaylistApp.post('/api/yourplaylists/addSong', UrPlaylistController.addSongToUrPlaylist);
urPlaylistApp.get('/api/yourplaylists/:urplaylistId/checkSong/:songId', UrPlaylistController.checkSongExist);
urPlaylistApp.delete('/api/yourplaylists/deleteUrPlaylist/:urplaylistId', UrPlaylistController.deleteUrPlaylistById);
urPlaylistApp.delete('/api/yourplaylists/:urplaylistId/deleteSong/:songId', UrPlaylistController.deleteSongFromUrPlaylist);
urPlaylistApp.patch('/api/yourplaylists/updateDescription/:urplaylistId', UrPlaylistController.updatePlaylistDescription);
urPlaylistApp.patch('/api/yourplaylists/updateName/:urplaylistId', UrPlaylistController.updatePlaylistName);
urPlaylistApp.patch('/api/yourplaylists/updateImage/:urplaylistId', UrPlaylistController.updatePlaylistImage);

module.exports = urPlaylistApp;
