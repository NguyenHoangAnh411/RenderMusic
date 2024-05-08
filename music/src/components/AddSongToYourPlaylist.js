import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from '../stores/player';
import './css/AddSongToYourPlaylist.css';
import { useParams } from 'react-router-dom';

const AddSong = ({ addSong, song, urplaylistId }) => {
  const dispatch = useDispatch();
  const { current } = useSelector(state => state.player);
  const [isSongInPlaylist, setIsSongInPlaylist] = useState(false);

  const checkSongExistInPlaylist = async () => {
    try {
      // Kiểm tra xem biến song có tồn tại không trước khi gửi request
      if (song) {
        const response = await axios.get(`http://localhost:5011/api/yourplaylists/${urplaylistId}/checkSong/${song._id}`);
        setIsSongInPlaylist(response.data.exists);
      }
    } catch (error) {
      console.error('Error checking song in playlist:', error);
    }
  };
  
  useEffect(() => {
    checkSongExistInPlaylist();
  }, [song, urplaylistId]);
  

  const updateCurrent = async () => {
    try {
      const isPlaying = current?.id === song._id;
      dispatch(setCurrent({
        id: isPlaying ? null : song._id,
        title: isPlaying ? null : song.title,
        artist: isPlaying ? null : song.author,
        image: isPlaying ? null : song.image_path,
        lyric: isPlaying ? null : song.lyric,
        src: isPlaying ? null : song.song_path,
      }));
    } catch (error) {
      console.error('Error updating current song:', error);
    }
  }

  if (!song) {
    return <div>Bài hát không tồn tại</div>;
  }

  const handleAddSong = async () => {
    try {
      await addSong(song._id);
      setIsSongInPlaylist(true);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  return (
    <NavLink onDoubleClick={updateCurrent} className="song-container">
      <div className="song-image">
        <img src={song.image_path} alt={song.title} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1'
          }}
          className="p-2 hover:scale-105"
        >
          <Icon name={!current.id && song._id ? 'pplay' : 'ppause'} style={{ color: 'white' }} />
        </div>
      </div>
      <div className="song-details">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.author}</span>
      </div>
      
      {!isSongInPlaylist && <button className="add-button" onClick={handleAddSong}>Add</button>}
    </NavLink>
  );
}

export default AddSong;
