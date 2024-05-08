import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent } from '../stores/player';

export default function Song({ song }) {
  const dispatch = useDispatch();
  const { current } = useSelector(state => state.player);

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

  if (!song || !song.image_path) {
    return null;
  }

  return (
    <NavLink
      style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1F2937', borderRadius: '8px', padding: '8px', transition: 'background-color 0.3s', marginBottom: '10px' }}
      key={song._id}
      className={'group flex items-center'}
      onClick={updateCurrent}
    >
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', zIndex: '0' }} src={song.image_path} alt={song.title} />
      </div>
      <div style={{ flex: 2, marginLeft: '10px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#FFF', whiteSpace: 'nowrap' }}>{song.title}</span> <br />
        <span style={{ marginTop: '2px', fontSize: '14px', color: '#6B7280' }}>{song.author}</span>
      </div>
      <button style={{ width: '32px', height: '32px', backgroundColor: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', opacity: '0', transition: 'opacity 0.3s' }} className="group-hover:opacity-100 group-active:opacity-100">
        <Icon name="like" style={{ color: '#FFF' }} />
      </button>
    </NavLink>
  );
}
