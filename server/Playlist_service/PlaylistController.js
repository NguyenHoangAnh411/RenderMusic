const Song = require('../song_service/SongModel');
const Playlist = require('./PlaylistModel');

const addPlaylist = async (req, res) => {
  try {
      if (req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'Access denied. Only Admin users can add playlists.' });
      }

      const { name, position, image } = req.body;

      const songs = await Song.find({ author: name });

      const newPlaylist = new Playlist({
        name,
        position,
        image,
        songs
      });

      const savedPlaylist = await newPlaylist.save();
  
      res.status(201).json(savedPlaylist);
    } catch (error) {
      console.error('Error adding playlist:', error);
      res.status(500).json({ message: 'Failed to add playlist' });
    }
}


const getPlaylists = async (req, res) => {
    try {
      const playlists = await Playlist.find();
      res.status(200).json(playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({ message: 'Failed to fetch playlists' });
    }
};

const getPlaylistById = async (req, res) => {
    try {
      const { id } = req.params;
      const playlist = await Playlist.findById(id);
      console.log('Playlist ID:', req.params.id);

      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      res.status(200).json(playlist);
    } catch (error) {
      console.error('Error fetching playlist by ID:', error);
      res.status(500).json({ message: 'Failed to fetch playlist' });
    }
};

const getSongsInPlaylist = async (req, res) => {
  try {
      const { playlistId } = req.params;

      const playlist = await Playlist.findById(playlistId);

      if (!playlist) {
          return res.status(404).json({ error: 'Playlist not found' });
      }

      const songIds = playlist.songs;

      const songs = await Song.find({ _id: { $in: songIds } });

      res.json(songs);
  } catch (error) {
      console.error('Error getting songs in playlist:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addPlaylist, getPlaylists, getPlaylistById, getSongsInPlaylist };
