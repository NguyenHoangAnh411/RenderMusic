const Song = require('./SongModel');
const Playlist = require('../Playlist_service/PlaylistModel');
const mongoose = require('mongoose');
const getSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        console.error('Error getting songs:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updatePlaylist = async (artistName, songIds) => {
    try {
      const playlist = await Playlist.findOne({ name: artistName });
  
      if (playlist) {

        playlist.songs = songIds;

        await playlist.save();
      } else {
        console.error('Playlist not found for artist:', artistName);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  }
  

  const addSong = async (req, res) => {
    try {
        const { author, title, song_path, image_path, lyric } = req.body;

        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Only Admins can add songs.' });
        }

        const newSong = new Song({
            author,
            title,
            song_path,
            image_path,
            lyric
        });

        const savedSong = await newSong.save();

        await updatePlaylist(author, [savedSong._id]);
        res.status(201).json(savedSong);
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ error: 'An error occurred while adding the song.' });
    }
};

const getSongById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid song ID' });
        }

        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.json(song);
    } catch (error) {
        console.error('Error getting song by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const search = async (req, res) => {
    try {
        const { query } = req.query;

        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        });
        const playlists = await Playlist.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }
            ]
        });

        const searchResult = {
            songs,
            playlists
        };

        res.json(searchResult);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = { getSongs, addSong, getSongById, search };
