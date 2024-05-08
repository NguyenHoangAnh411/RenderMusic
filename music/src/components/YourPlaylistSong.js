import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '@headlessui/react';
import axios from 'axios';
import { setCurrent, setPlaying } from '../stores/player';
import './css/YourPlaylistSong.css';

export default function YourPlayListSong({ song, index, addedAt, DeleteSong, fetchLikedSongs, isQueue }) {
    const dispatch = useDispatch();
    const { current } = useSelector(state => state.player); 

    const date = new Date(addedAt);
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const { urplaylistId } = useParams();
    const [isSongLiked, setIsSongLiked] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
          }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, []);
    const checkSongIsLiked = async () => {
        try {
            if (song._id) {
                const response = await axios.get(`http://localhost:5014/api/users/checkSong/${song._id}`, {
                    headers: {
                        Authorization: token,
                    }
                });
                setIsSongLiked(response.data.exists);
            }
        } catch (error) {
            console.error('Error checking song in playlist:', error);
        }
    };
    
    useEffect(() => {
        checkSongIsLiked();
    }, [song._id]);
    

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
                    playlistId: urplaylistId,
                };
    
                dispatch(setCurrent(currentSong));
                dispatch(setPlaying(true));
            }
        } catch (error) {
            console.error('Error updating current song:', error);
        }
    };
    
    

    const handleOpenControl = () => {
        setShowMenu(!showMenu);
    };

    const handleDeleteSong = () => {
        if (DeleteSong) {
            DeleteSong();
        }
        setShowMenu(false);
    };

    const handleLikeSong = async (songId) => {
        try {
            const response = await axios.post(
                `http://localhost:5014/api/users/addLikedSong/${songId}`,
                null,
                {
                    headers: {
                        Authorization: token,
                    }
                }
            );
            if (response.status === 201) {
                setIsSongLiked(true);
                setShowMenu(false);
            }
        } catch (error) {
            console.error('Error liking song:', error);
        }
    };

    const handleUnLikeSong = async (songId) => {
        try {
            const response = await axios.delete(`http://localhost:5014/api/users/unlikeSong/${songId}`, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.status === 200) {
                setIsSongLiked(false);
                setShowMenu(false);
                fetchLikedSongs();
            }
        } catch (error) {
            console.error('Error unliking song:', error);
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            <NavLink
                className='NavLink'
                onDoubleClick={updateCurrent}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#1F2937', borderRadius: '8px', padding: '10px', marginBottom: '10px', marginLeft: '1%', cursor: 'default',
                    
                }}
                key={song._id}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: !isQueue ? '25%' : '100%'}}>
                    <div style={{ color: 'grey', width: '5%' }}>
                        {index}
                    </div>
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <img style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', zIndex: '0' }} src={song.image_path} alt={song.title} />
                    </div>
                    <div style={{ flex: 2, marginLeft: '10px', width: '10%' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#FFF', whiteSpace: 'nowrap' }}> {song.title}</span> <br />
                        <span style={{ marginTop: '2px', fontSize: '14px', color: '#6B7280' }}>{song.author}</span>
                    </div>
                </div>

                {addedAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%' }}>
                        <div style={{ color: 'white', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='Album'>
                            <span>{song.title}</span>
                        </div>
                        <div style={{ color: 'white', width: '50%' }} className="song-addedAt">
                            <span
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                            </span>
                        </div>
                    </div>
                )}
                {
                    !isQueue && (
                    <div onClick={handleOpenControl} style={{
                        width: '24%', display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <button style={{
                            color: 'white',
                            fontSize: '20px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            ...
                        </button>
                    </div>
                    )
                }
                
            </NavLink>
            {showMenu && (
                <Menu as='div' className='menu'>
                    <Menu.Item>
                        {({ open }) => (
                            !isSongLiked ?
                                <button
                                    onClick={() => handleLikeSong(song._id)}
                                    className={`menu-item ${open ? 'open' : ''}`}
                                >
                                    Like
                                </button>
                                :
                                <button
                                    onClick={() => handleUnLikeSong(song._id)}
                                    className={`menu-item ${open ? 'open' : ''}`}
                                >
                                    Unlike
                                </button>
                        )}
                    </Menu.Item>

                    {DeleteSong && (
                        <div>
                            <div className='divider'></div>
                            <Menu.Item>
                                {({ open }) => (
                                    <button
                                        onClick={() => handleDeleteSong()}
                                        className={`menu-item ${open ? 'open' : ''}`}
                                    >
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    )}

                </Menu>
            )}
        </div>
    );
}
