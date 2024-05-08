const UrPlaylist = require('./UrPlaylistModel');
const Song = require('../song_service/SongModel');
const admin = require("firebase-admin");
const serviceAccount = require('../firebaseServices/finalsoa-fae05-firebase-adminsdk-w7pyy-186d80d142.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "gs://finalsoa-fae05.appspot.com"
//   });
const getPlaylist = async (req, res) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const playlists = await UrPlaylist.find({ userId: currentUser._id });

        res.json(playlists);
    } catch (error) {
        console.error("Error getting playlists:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



const addYourPlaylist = async (req, res) => {
    try {
        const currentUser = req.user;

        const newPlaylistData = {
            userId: currentUser._id,
            name: req.body.name,
            image_path: req.body.image_path ? req.body.image_path : 'https://img.lovepik.com/element/45000/2939.png_860.png',
            addedAt: Date.now()
        };

        const newPlaylist = new UrPlaylist(newPlaylistData);
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error("Error adding playlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUrPlaylistById = async (req, res) => {
    try {
        const { urplaylistId } = req.params;
      const playlist = await UrPlaylist.findById(urplaylistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      res.status(200).json(playlist);
    } catch (error) {
      console.error('Error fetching playlist by ID:', error);
      res.status(500).json({ message: 'Failed to fetch playlist' });
    }
};



const getSongsInUrPlaylist = async (req, res) => {
    try {
        const { urplaylistId } = req.params;

        const playlist = await UrPlaylist.findById(urplaylistId);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const songIds = playlist.songs.map(song => song.song);
        const addedAt = playlist.songs.map(entry => entry.addedAt);

        const songs = await Song.find({ _id: { $in: songIds } });

        // Thêm thuộc tính addedAt vào mỗi đối tượng bài hát
        const songsWithAddedAt = songs.map((song, index) => ({
            ...song.toObject(),
            addedAt: addedAt[index]
        }));

        res.json({ songs: songsWithAddedAt, songCount: songsWithAddedAt.length });
    } catch (error) {
        console.error('Error getting songs in playlist:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



const addSongToUrPlaylist = async (req, res) => {
    try {
        const { urplaylistId, songId } = req.body;

        if (!urplaylistId || !songId) {
            return res.status(400).json({ message: "Both urplaylistId and songId are required" });
        }

        const playlist = await UrPlaylist.findById(urplaylistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        if (playlist.songs.some(s => s.song.toString() === songId)) {
            return res.status(400).json({ message: "Song already exists in the playlist" });
        }

        playlist.songs.push({ song: songId, addedAt: Date.now() });
        await playlist.save();

        res.status(200).json({ message: "Song added to playlist successfully", playlist });
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}



const search = async (req, res) => {
    try {
        const { query } = req.query;

        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        });

        const searchResult = {
            songs
        };

        res.json(searchResult);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const checkSongExist = async (req, res) => {
    try {
        const { urplaylistId, songId } = req.params;

        const playlist = await UrPlaylist.findById(urplaylistId);
        if (!playlist) {
          return res.status(404).json({ message: 'Playlist not found' });
        }

        const songIndex = playlist.songs.findIndex(song => song.song.toString() === songId);

        if (songIndex === -1) {
            return res.json({ exists: false });
        } else {
            return res.json({ exists: true });
        }
    } catch (error) {
        console.error('Error checking song in playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const deleteUrPlaylistById = async (req, res) => {
    try {
        const { urplaylistId } = req.params;

        const deletedPlaylist = await UrPlaylist.findByIdAndDelete(urplaylistId);

        if (!deletedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Playlist deleted successfully', deletedPlaylist });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteSongFromUrPlaylist = async (req, res) => {
    try {
        const { urplaylistId, songId } = req.params;

        const playlist = await UrPlaylist.findById(urplaylistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const indexToRemove = playlist.songs.findIndex(song => song.song.toString() === songId);

        if (indexToRemove === -1) {
            return res.status(404).json({ message: 'Song not found in playlist' });
        }

        playlist.songs.splice(indexToRemove, 1);
        await playlist.save();

        res.status(200).json({ message: 'Song removed from playlist successfully', playlist });
    } catch (error) {
        console.error('Error deleting song from playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updatePlaylistImage = async (req, res) => {
    try {
        const { urplaylistId } = req.params;
        const { image_path } = req.body;

        const updatedPlaylist = await UrPlaylist.findByIdAndUpdate(
            urplaylistId,
            { image_path },
            { new: true }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error('Error updating playlist name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




const updatePlaylistName = async (req, res) => {
    try {
        const { urplaylistId } = req.params;
        const { name } = req.body;

        const updatedPlaylist = await UrPlaylist.findByIdAndUpdate(
            urplaylistId,
            { name },
            { new: true }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error('Error updating playlist name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updatePlaylistDescription = async (req, res) => {
    try {
      const { urplaylistId } = req.params;
      const { description } = req.body;
  
      const updatedPlaylist = await UrPlaylist.findByIdAndUpdate(
        urplaylistId,
        { description },
        { new: true }
      );
  
      if (!updatedPlaylist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      res.status(200).json(updatedPlaylist);
    } catch (error) {
      console.error('Error updating playlist description:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


module.exports = { 
    getPlaylist, 
    addYourPlaylist, 
    getSongsInUrPlaylist, 
    getUrPlaylistById, 
    addSongToUrPlaylist, 
    search, checkSongExist, 
    deleteUrPlaylistById, 
    deleteSongFromUrPlaylist,
    updatePlaylistImage,
    updatePlaylistName,
    updatePlaylistDescription
 };
