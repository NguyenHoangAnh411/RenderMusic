import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.js';
import './css/LikedSongs.css';
import YourPlayListSong from '../components/YourPlaylistSong.js';
import { useParams } from 'react-router-dom';
import SongInfo from '../components/SongInfo.js';
import Queue from '../components/Queue.js';
import { useSelector } from 'react-redux';


export default function LikedSong() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedAt, setLikedAt] = useState([]);
  const {  showQueue } = useSelector(state => state.player);
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
        try {
        const response = await axios.get(`http://localhost:5014/api/users/getSongs`, {
            headers: {
            Authorization: token,
            }
        });
        setLikedSongs(response.data.likedSongs);
        setLikedAt(response.data.likedAt);
        console.log(response.data.likedAt)
        } catch (error) {
        console.error('Error fetching liked songs:', error);
        }
    };

  return (
    <div style={{display: 'flex'}} className='flex-auto overflow-hidden'>
      <div style={{width: showQueue ? '70%' : '100%', overflowY: 'auto'}}>
        <div className='likedsongs-container'>
          <Navbar/>
          <div className='likedsong-info'>
            <img className='likedsong-img' src={'https://img.lovepik.com/element/45000/2939.png_860.png'} alt="Liked Song Image" />
            <div className='likedsong-details'>
              <h3>Playlist</h3>
              <h2>Liked Songs</h2>
            </div>
          </div>
        </div>
        <SongInfo/>
        <div className='YourSong'>
          <div id='song-grid' style={{display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
            {likedSongs.length > 0 ? (
              likedSongs.map((song, index) => (
                  <YourPlayListSong 
                  key={song._id} 
                  song={song}     
                  index={index + 1} 
                  
                  addedAt={likedAt[index]}
                  DeleteSong={null}
                  fetchLikedSongs={fetchLikedSongs}
                  isLikedSong={true}
                />
                

              ))
            ) : (
              <div style={{margin: 'auto', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                  <h2 style={{color: 'white', marginTop: '20%', fontSize: '30px', fontWeight: 'bold'}}>Songs you like will appear here</h2>
                  <a href='/search' className='btn-findSong'>Find songs</a>
              </div>
            )}
          </div>
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
