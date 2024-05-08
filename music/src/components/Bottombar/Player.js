import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../Icons';
import { useAudio } from 'react-use';
import { secondsToTime } from '../../Utils';
import MyRange from '../MyRange';
import { setCurrent, setControls, setQueuePlaylistSong, setShowQueue, toggleShuffle } from '../../stores/player';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Player.css';

export default function Player() {
    const dispatch = useDispatch();
    const { current, playlistId, showQueue } = useSelector(state => state.player);
    const location = useLocation();
    const navigate = useNavigate();
    const [currentSong, setCurrentSong] = useState(null);
    const curVol = JSON.parse(localStorage.getItem('volume'));
    const [currentVolume, setCurrentVolume] = useState(curVol !== null ? curVol : 1);
    const [playlistSong, setPlaylistSong] = useState([]);
    const [isRepeat, setIsRepeat] = useState(false);
    const { shuffle } = useSelector(state => state.player);
    const handleEnded = () => {
        if (isRepeat) {
            controls.seek(0);
            controls.play();
        } else {
            handleNext();
        }
    };
    const [audio, state, controls, ref] = useAudio({
        src: current?.src,
        onEnded: handleEnded,
    });

    useEffect(() => {
        controls.play();
    }, [current]);

    useEffect(() => {
        dispatch(setControls({ isPlaying: state.playing }));
    }, [dispatch, state.playing]);

    useEffect(() => {
        if (current) {
            localStorage.setItem('currentSong', JSON.stringify(current));
        }
    }, [current]);

    useEffect(() => {
        if (state.volume !== currentVolume) {
            controls.volume(currentVolume);
        }
    }, [state.volume, currentVolume, controls]);

    useEffect(() => {
        if (state.volume) {
            localStorage.setItem('volume', state.volume.toString());
        }
    }, [state.volume]);

    useEffect(() => {
        const lastPlayedSong = JSON.parse(localStorage.getItem('currentSong'));
        if (lastPlayedSong) {
            setCurrentSong(lastPlayedSong);
        }
    }, []);


    const volumeIcon = useMemo(() => {
        if (state.volume === 0 || state.muted) return 'mute';
        if (state.volume > 0 && state.volume < 0.33) return 'low';
        if (state.volume >= 0.33 && state.volume < 0.66) return 'mid';
        return 'full';
    }, [state.volume, state.muted]);

    const [showLyrics, setShowLyrics] = useState(false);
    const [previousPage, setPreviousPage] = useState(null);

    useEffect(() => {
        if (!showLyrics) {
            setPreviousPage(location.pathname);
        }
    }, [location.pathname, showLyrics]);

    const handleMicClick = () => {
        if (showLyrics) {
            navigate(previousPage);
            setShowLyrics(false);
        } else {
            setPreviousPage(location.pathname);
            navigate('/lyric', { state: { lyric: current?.lyric || '' } });
            setShowLyrics(true);
        }
    };

    const handleQueueClick = () => {
        dispatch(setShowQueue(!showQueue));
        if (!showQueue) {
            setPreviousPage(location.pathname);
        }
    };

    let currentIndex = 0;
    const handleNext = () => {
        if (playlistSong && playlistSong.length > 0) {
            if (shuffle) {
                const randomIndex = Math.floor(Math.random() * playlistSong.length);
                const randomSong = playlistSong[randomIndex];
                const randomSongPayload = {
                    id: randomSong._id,
                    artist: randomSong.author,
                    title: randomSong.title,
                    src: randomSong.song_path,
                    image: randomSong.image_path,
                    lyric: randomSong.lyric,
                };
                dispatch(setCurrent(randomSongPayload));
            } else {
                currentIndex = playlistSong.findIndex(song => song._id === current.id);
                let nextIndex = currentIndex + 1;
                if (nextIndex >= playlistSong.length) {
                    nextIndex = 0;
                }
                const nextSong = playlistSong[nextIndex];
        
                const nextSongPayload = {
                    id: nextSong._id,
                    artist: nextSong.author,
                    title: nextSong.title,
                    src: nextSong.song_path,
                    image: nextSong.image_path,
                    lyric: nextSong.lyric,
                };
        
                dispatch(setCurrent(nextSongPayload));
            }
        }
    };

    const handlePrevious = () => {
        if (playlistSong && playlistSong.length > 0) {
            currentIndex = playlistSong.findIndex(song => song._id === current.id);
            let previousIndex = currentIndex - 1;
            if (previousIndex < 0) {
                previousIndex = playlistSong.length - 1;
            }
            const previousSong = playlistSong[previousIndex];

            const previousSongPayload = {
                id: previousSong._id,
                artist: previousSong.author,
                title: previousSong.title,
                src: previousSong.song_path,
                image: previousSong.image_path,
                lyric: previousSong.lyric,
            };

            dispatch(setCurrent(previousSongPayload));
        }
    };

    const fetchPlaylist = async () => {
        try {
            if (playlistId !== undefined && playlistId !== null) {
                const songResponse = await axios.get(`http://localhost:5011/api/yourplaylists/getSong/${playlistId}`);
                setPlaylistSong(songResponse.data.songs);
                dispatch(setQueuePlaylistSong(songResponse.data.songs));
            }
        } catch (error) {
            console.error('Error fetching playlist:', error);
        }
    };

    useEffect(() => {
        if (playlistId !== undefined && playlistId !== null) {
            fetchPlaylist();
        }
    }, [playlistId]);



    const toggleRepeat = () => {
        setIsRepeat(!isRepeat);
    };
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const appElement = document.documentElement;
        if (!document.fullscreenElement) {
            appElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleExitFullscreen = () => {
            if (state.playing) {
                controls.play();
            }
        };
    
        document.addEventListener('fullscreenchange', handleExitFullscreen);
    
        return () => {
            document.removeEventListener('fullscreenchange', handleExitFullscreen);
        };
    }, [state.playing, controls]);
    

    return (
        <div className={`fullscreen ${isFullscreen ? 'active' : ''}`}>
            {isFullscreen && (
                <div className="overlay"></div>
            )}
            {isFullscreen && (
                <img className="fullscreen-image" src={(current != null ? current.image : currentSong?.image) || ''} alt="Fullscreen" />
            )}
        
            <div
                style={{
                    position: 'fixed',
                    marginBottom: '30px',
                    width: '100%',
                    height: !isFullscreen ? '5%' : '20%',
                    padding: '10px'
                }}
                className="control-bar flex flex-col max-w-[100%] w-[100%]">
                
                <div 
                    style={{
                        width: isFullscreen ? '100%' : '50%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '2px',
                    }} 
                    className='flex items-center gap-x-2'>
                        {audio}
                        <div className='text-[11px] text-gribottom'>
                            {secondsToTime(state?.time)}
                        </div>
                        <MyRange
                            step={0.1}
                            min={0}
                            max={state?.duration || 1}
                            value={state?.time}
                            onChange={value => controls.seek(value)}
                        />
                    <div className='text-[11px] text-gribottom'>
                        {secondsToTime(state?.duration)}
                    </div>
                </div>
        
                <div style={{ justifyContent: 'space-between'}} className='flex w-full'>
        
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }} >
                        {(current || currentSong) && (
                            <div className='flex '>
                                <div className='flex items-center'>
                                    <div className='w-14 h-14 mr-3'>
                                        <img src={(current != null ? current.image : currentSong?.image) || ''} alt="Song cover" />
                                    </div>
                                    <div>
                                        <h4 className='text-sm text-white'>{current ? current.title : currentSong?.title}</h4>
                                        <h6 className='text-[0.688rem] text-tartist'>{current ? current.artist : currentSong?.artist}</h6>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
        
                    <div style={{ display: 'flex', alignItems:'center', justifyContent: 'space-between'}}>
                        <button onClick={() => dispatch(toggleShuffle())} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100'>
                            <Icon name={'shuffle'} />
                        </button>
                        <button onClick={handlePrevious} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100'>
                            <Icon name="playerprev" />
                        </button>
                        <button style={{ margin: '10px', width: isFullscreen ? '80px' : '40px', height: isFullscreen ? '80px' : '40px'}} onClick={controls[state?.playing ? 'pause' : 'play']} className='flex items-center justify-center text-white text-opacity-70'>
                            <div style={{alignItems: 'center', justifyContent: 'center', width: isFullscreen ? '80px' : '40px', height: isFullscreen ? '80px' : '40px'}} className='bg-white rounded-full p-2 flex'>
                                <Icon name={state?.playing ? 'ppause' : 'pplay'} />
                            </div>
                        </button>
        
                        <button onClick={handleNext} className='w-8 h-8 flex items-center justify-center text-white'>
                            <Icon name="playernext" />
                        </button>
                        <button style={{ color: isRepeat ? 'green' : 'white' }} onClick={toggleRepeat} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100'>
                            <Icon name={'repeat'} />
                        </button>
                    </div>
        
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button style={{color: showLyrics ? 'green' : '#fff'}} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100' onClick={handleMicClick}>
                            <Icon name="mic" />
                        </button>
                        <button  style={{color: showQueue ? 'green' : '#fff'}} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100' onClick={handleQueueClick}>
                            <Icon name="addlist" />
                        </button>
                        <button onClick={controls[state?.muted ? 'unmute' : 'mute']} className='w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100'>
                            <Icon name={volumeIcon} />
                        </button>
                        <div className='w-[5.813rem]'>
                            <MyRange
                                step={0.01}
                                min={0}
                                max={1}
                                value={state.muted ? 0 : state.volume}
                                onChange={(value) => {
                                    controls.unmute();
                                    setCurrentVolume(value);
                                }}
                            />
                        </div>
                        <button className='control-button' onClick={toggleFullscreen}>
                            <Icon name="fullscreen" />
                        </button>
                    </div>
                </div>
        
            </div>
            
        </div>
        
    );
}
