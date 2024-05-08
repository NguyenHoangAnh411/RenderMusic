import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchSongInPlayList from '../components/SearchSongInPlayList';
import AddSong from '../components/AddSongToYourPlaylist';
import './css/UrPlaylist.css';
import YourPlayListSong from '../components/YourPlaylistSong';
import { useParams } from 'react-router-dom';
import EditUrPlaylistModal from '../components/Modals/EditUrPlaylistModal';
import SongInfo from '../components/SongInfo';
import Queue from '../components/Queue';
import { useSelector } from 'react-redux';

export default function YourPlaylist() {
  const [playlist, setPlaylist] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [playlistSong, setPlaylistSong] = useState([]);
  const { urplaylistId } = useParams();
  const [count, setCount] = useState(0);
  const [isSongInPlaylist, setIsSongInPlaylist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQueueFromPlayer, setShowQueueFromPlayer] = useState(false);
  const {  showQueue } = useSelector(state => state.player);
  const fetchPlaylist = async () => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        Authorization: `${token}`,
      };

      const playlistResponse = await axios.get(`http://localhost:5011/api/yourplaylists/${urplaylistId}`, { headers });
      setPlaylist(playlistResponse.data);
  
      const songResponse = await axios.get(`http://localhost:5011/api/yourplaylists/getSong/${urplaylistId}`, { headers });
      setPlaylistSong(songResponse.data.songs);
      setCount(songResponse.data.songCount);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };
  

  useEffect(() => {
    fetchPlaylist();
  }, [urplaylistId]);

    const updateSearchResults = async (query) => {
      try {
        if (query.trim() === '') {
          setSearchResults([]);
          return;
        }

        const response = await axios.get(`http://localhost:5011/api/yourplaylists/search?query=${query}`);

        if (response.data && response.data.songs) {
          setSearchResults(response.data.songs);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching:', error);
      }
    };


  const checkSongExistInPlaylist = async (songId) => {
    try {
      const response = await axios.get(`http://localhost:5011/api/yourplaylists/${urplaylistId}/checkSong/${songId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking song in playlist:', error);
      return false;
    }
  };

  const handleAddSongToUrPlaylist = async (songId) => {
    try {
      const response = await axios.post('http://localhost:5011/api/yourplaylists/addSong', {
        urplaylistId,
        songId
      });

      const updatedSongResponse = await axios.get(`http://localhost:5011/api/yourplaylists/getSong/${urplaylistId}`);
      setPlaylistSong(updatedSongResponse.data.songs);
      setCount(updatedSongResponse.data.songCount);

      const exists = await checkSongExistInPlaylist(songId);
      setIsSongInPlaylist(exists);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  const deleteSong = async (playlistId, songId) => {
    try {
      const response = await axios.delete(`http://localhost:5011/api/yourplaylists/${playlistId}/deleteSong/${songId}`);
  
      const updatedSongResponse = await axios.get(`http://localhost:5011/api/yourplaylists/getSong/${playlistId}`);
      setPlaylistSong(updatedSongResponse.data.songs);
      setCount(updatedSongResponse.data.songCount);
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };


  const handleUpdatePlaylistName = async (playlistId, newName) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateName/${playlistId}`, { name: newName });
  
      if (response.status !== 200) {
        throw new Error('Failed to update playlist name');
      }
  
      fetchPlaylist();
    } catch (error) {
      console.error('Error updating playlist name:', error);
      throw new Error('Failed to update playlist name');
    }
  };
  
  const handleUpdatePlaylistDescription = async (playlistId, newDescription) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateDescription/${playlistId}`, { description: newDescription });
  
      if (response.status !== 200) {
        throw new Error('Failed to update playlist description');
      }
  
      fetchPlaylist();
    } catch (error) {
      console.error('Error updating playlist description:', error);
      throw new Error('Failed to update playlist description');
    }
  };
  

  const handleUpdatePlaylistImage = async (playlistId, newImage) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateImage/${playlistId}`, { image_path: newImage });

      if (response.status === 200) {
        fetchPlaylist();
      } else {
        console.error('Failed to update playlist image');
      }
    } catch (error) {
      console.error('Error updating playlist image:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("Opened")
  };
  return (
    <div style={{ display: 'flex' , overflow: 'visible' }}>
      <div style={{ width: showQueue ? '70%' : '100%', position: 'relative', zIndex: '1', overflowY: 'auto'}}>
        <div className='urplaylist-container'>
          <Navbar />
          <div onClick={handleOpenModal} className='urplaylist-info'>
            <img className='urplaylist-img' src={playlist.image_path} alt="Playlist Image" />
            <div className='urplaylist-details'>
              <h3>Playlist</h3>
              <h2 >{playlist.name}</h2>
              <p>{playlist.description}</p>
            </div>
          </div>
        </div>
        <SongInfo />
        <div className='YourSong'>
          <div id='song-grid' style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            {count > 0 ? (
              playlistSong.map((song, index) => (
                <YourPlayListSong
                  key={song._id}
                  song={song}
                  index={index + 1}
                  addedAt={song.addedAt}
                  DeleteSong={() => deleteSong(urplaylistId, song._id)}
                />
              ))
            ) : (
              <div style={{ color: 'white', fontSize: '30px', marginLeft: '2%' }}>Let's find something for your playlist</div>
            )}
          </div>
        </div>
        <SearchSongInPlayList onUpdateSearch={updateSearchResults} />
        <div id='song-grid' style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map(song => (
              <AddSong addSong={handleAddSongToUrPlaylist} urplaylistId={urplaylistId} key={song._id} song={song} />
            ))
          ) : (
            <div style={{ color: 'white', margin: 'auto' }}>No search results found</div>
          )}
        </div>
      </div>
      {showQueue && (
        <div style={{ width: '30%', zIndex: '1' }}>
          <Queue className='Queue' />
        </div>
      )}
  
      {isModalOpen && (
        <EditUrPlaylistModal
          updateDes={handleUpdatePlaylistDescription}
          updateName={handleUpdatePlaylistName}
          updateImg={handleUpdatePlaylistImage}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          playlist={playlist}
        />
      )}
    </div>
  );
  
  
}
