import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent, setPlaying } from '../stores/player';

export default function Song({ song }) {
  const dispatch = useDispatch();
  const { current } = useSelector(state => state.player);

  const updateCurrent = async () => {
    try {
        const isPlayingCurrentSong = current?.id === song._id && current?.playing;
        const isCurrentSong = current?.id === song._id;

        if (isCurrentSong) {
            dispatch(setPlaying(!isPlayingCurrentSong));
        } else {
            const currentSong = {
                id: song._id,
                title: song.title,
                artist: song.author,
                image: song.image_path,
                lyric: song.lyric,
                src: song.song_path,
            };

            dispatch(setCurrent(currentSong));
            dispatch(setPlaying(true));
        }
    } catch (error) {
        console.error('Error updating current song:', error);
    }
};


  if (!song || !song.image_path) {
    return null;
  }

  return (
    <NavLink key={song._id} className={'bg-footer rounded p-4 transition-all hover:bg-menubg group'}>
      <div className='relative '>
        <img className='w-auto h-auto inset-0 object-cover mb-4' src={song.image_path} alt={song.title} />
        <button onClick={updateCurrent} className='w-12 h-12 bg-primary absolute right-2 bottom-2 transition-opacity rounded-full flex items-center shadow-2xl justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100'>
          <Icon name={current?.id === song._id ? 'pause' : 'play'} />
        </button>
      </div>
      <span className='font-semibold text-white text-[16px] whitespace-nowrap'>{song.title}</span> <br />
      <span className='mt-1 text-[14px] text-link'>{song.author}</span>
    </NavLink>
  )
}
