import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PlayListSong from '../components/YourPlaylistSong.js';
import Navbar from '../components/Navbar.js';
import "./css/Playlist.css"
import Queue from '../components/Queue.js';
import { useSelector } from 'react-redux';

export default function Playlist() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const {  showQueue } = useSelector(state => state.player);
  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);
  
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:5013/api/playlists/${playlistId}`);
      setPlaylist(response.data);
      fetchSongsInPlaylist(response.data.songs);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const fetchSongsInPlaylist = async (songIds) => {
    try {
      const response = await axios.get(`http://localhost:5013/api/playlists/getSong/${playlistId}`);
      console.log('Songs in playlist:', response.data);
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs in playlist:', error);
    }
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{display: 'flex'}} className='flex-auto overflow-hidden'>
      <div style={{width: showQueue ? '70%' : '100%', overflowY: 'auto'}}>
        <Navbar/>
        <div className='playlist-container'>
          <img className='playlist-img' src={playlist.image} alt={playlist.name} />
          <div className='playlist-details'>
            <p>{playlist.position}</p>
            <h2>{playlist.name}</h2>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}} id='song-grid' className='mb-8 mt-5'>
          {songs.map(song => (
            <PlayListSong key={song._id} song={song} />
          ))}
        </div>
      </div>
      {showQueue && (
        <div style={{width: '30%'}}>
          <Queue className='Queue' />
        </div>
      )}
    </div>
  );
}
