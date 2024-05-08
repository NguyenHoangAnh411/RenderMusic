import React, { useEffect, useState } from 'react';
import PlayBox from '../components/PlayBox.js';
import { NavLink } from 'react-router-dom';
import { Icon } from '../components/Icons.js';
import Song from '../components/Song.js';
import axios from 'axios';
import "./css/Home.css"
import Queue from '../components/Queue.js';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar.js';

export default function Home() {
  const [mixer, setMixer] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showAllSongs, setShowAllSongs] = useState(false);
  const {  showQueue } = useSelector(state => state.player);
  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
  }, []);


  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5012/api/songs/');
      setSongs(response.data); 
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };
  
  
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:5013/api/playlists/');
      setMixer(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleSeeAllSongs = async () => {
    setShowAllSongs(prevShowAllSongs => !prevShowAllSongs);
    console.log("Show Songs: " + showAllSongs);
    if (!showAllSongs) {
      await fetchSongs();
    }
  };
  

  return (
    <div style={{display: 'flex'}} className='flex-auto overflow-hidden'>
      
      <div style={{width: showQueue ? '70%' : '100%', overflowY: 'auto'}}>
      <Navbar/>
        <div>
          <div className='grid grid-cols-3 items-center justify-center gap-x-6 gap-y-4 mb-6 transition-all'>
            <a href='/likedSongs' className='flex items-center gap-x-4 bg-dortbox group relative hover:bg-dortboxact rounded'>
              <img className='w-[5rem] h-[5rem]' src="https://misc.scdn.co/liked-songs/liked-songs-640.png" />
              <h4 className='text-[16px] font-bold p-4'>Liked Songs</h4>
              <button className='w-12 h-12 bg-primary absolute right-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
                <Icon name="play"/>
              </button>
            </a>
          </div>
        </div>

        <div>
          <div className='flex justify-between items-end mb-4'>
            <PlayBox title={'List of Songs'} />
            <div id='see-all' className='text-link text-[12px] font-semibold tracking-widest bottom-0' onClick={handleSeeAllSongs}>{
              showAllSongs
              ? 'SHOW LESS'
              : 'SEE ALL'
            }</div>
          </div>

          <div>
            <div id='song-grid' className='flex justify-between items-end mb-4'>
              {showAllSongs 
                ? songs.map(song => (
                    <Song key={song._id} song={song} />
                  ))
                : songs.slice(0, 5).map(song => (
                    <Song key={song._id} song={song} />
                  ))}
            </div>
          </div>
        </div>

        <div className='flex justify-between items-end mb-4 mt-6'>
          <PlayBox title={'Popular artists'}/>
          <PlayBox see />
        </div>

        <div className='grid grid-cols-5 gap-x-6 mb-8'>
          {mixer.map(item => (
            <NavLink key={item._id} to={`/playlist/${item._id}`} className={'bg-footer rounded p-4 transition-all hover:bg-menubg group'}>
              <div className='relative'> 
                <img className='w-auto h-auto inset-0 object-cover mb-4' src={item.image} alt={item.name} />
                <button className='w-12 h-12 bg-primary absolute right-2 bottom-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
                  <Icon name="play"/>
                </button>
              </div>
              <span className='font-semibold text-white text-[16px] whitespace-nowrap'>{item.name}</span> <br />
              <span className='mt-1 text-[14px] text-link'>{item.position}</span>
            </NavLink>
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
