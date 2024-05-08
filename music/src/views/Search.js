import React, { useState, useEffect } from 'react';
import NavbarSearch from '../components/NavbarAndSearch.js';
import Song from '../components/Song.js';
import { NavLink } from 'react-router-dom';
import { Icon } from '../components/Icons.js';
import YourPlayListSong from '../components/YourPlaylistSong.js'
import Queue from '../components/Queue.js';
import { useSelector } from 'react-redux';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlistResults, setPlaylistResults] = useState([]);
  const {  showQueue } = useSelector(state => state.player);
  useEffect(() => {
    const storedSearchQuery = localStorage.getItem('searchQuery');
    if (storedSearchQuery) {
      setSearchQuery(storedSearchQuery);
      updateSearchResults(storedSearchQuery);
    }
  }, []);

  const updateSearchResults = async (query) => {
    try {
      setSearchQuery(query);

      localStorage.setItem('searchQuery', query);

      if (query.trim() === '') {
        setSearchResults([]);
        setPlaylistResults([]);
        return;
      }

      const response = await fetch(`http://localhost:5012/api/songs/search?query=${query}`);
      const data = await response.json();

      setSearchResults(data.songs);
      setPlaylistResults(data.playlists);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div style={{display: 'flex'}} className='flex-auto overflow-hidden'>
      <div style={{width: showQueue ? '70%' : '100%', overflowY: 'auto'}}>
      <NavbarSearch onUpdateSearch={updateSearchResults} />
      <div>
        <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Popular</h3>
        <div className='grid grid-cols-3 gap-x-5 mb-6'>
          <a className='overflow-hidden' href="#" >
            <div className='bg-purplebox h-[220px] rounded-lg p-4 relative'>
                <span className='text-4xl font-bold'>Pop</span>
                <img className='w-[128px] h-[128px] -right-5 bottom-0 absolute rotate-25 shadow-2xl'  src="https://t.scdn.co/images/0a74d96e091a495bb09c0d83210910c3" />
            </div>
          </a>
          <a className='overflow-hidden' href="#" >
            <div className='bg-orangebox h-[220px] rounded-lg p-4 relative'>
                <span className='text-4xl font-bold'>Hip Hop</span>
                <img className='w-[128px] h-[128px] -right-5 bottom-0 absolute rotate-25 shadow-2xl'  src="https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c" />
            </div>
          </a>
          <a className='overflow-hidden' href="#" >
            <div className='bg-redbox h-[220px] rounded-lg p-4 relative'>
                <span className='text-4xl font-bold'>Rock</span>
                <img className='w-[128px] h-[128px] -right-5 bottom-0 absolute rotate-25 shadow-2xl'  src="https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730" />
            </div>
          </a>
        </div>
      </div>

      {playlistResults.length > 0 && (
        <div className='mt-8'>
          <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Artists</h3>
          <div className='grid grid-cols-12 mb-8'>
            {playlistResults.map(item => (
              <NavLink key={item._id} to={`/playlist/${item._id}`} className={'bg-footer rounded p-4 transition-all hover:bg-menubg group col-span-3'}>
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
      )}

      <div className='mt-8'>
        <h3 className='text-2xl text-white font-bold tracking-tight mb-4'>Related songs</h3>
        {searchQuery.trim() !== '' && (
          <div style={{display: 'flex', flexDirection: 'column'}} id='song-grid' className='mb-8'>
            {searchResults.map(song => (
              <YourPlayListSong key={song._id} song={song} addedAt={null}/>
            ))}
          </div>
        )}
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
