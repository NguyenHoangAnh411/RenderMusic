import React from 'react';
import { useSelector } from 'react-redux';
import YourPlayListSong from './YourPlaylistSong';
import './css/Queue.css';

const Queue = () => {
    const { queuePlaylistSong, current: currentSong, showQueue } = useSelector(state => state.player) || [];

    const current = currentSong ? {
        ...currentSong,
        _id: currentSong.id,
        image_path: currentSong.image,
        song_path: currentSong.src,
        author: currentSong.artist
    } : null;

    const queueWithoutCurrent = queuePlaylistSong.filter(song => song._id !== current?.id);

    const shouldRenderCurrentSong = current !== null;
    const shouldRenderNextSongs = queueWithoutCurrent.length > 0;

    return (
        <div className={`queue-container ${showQueue ? 'show' : ''}`}>
            {showQueue && (
                <div className="queue-list">
                    {shouldRenderCurrentSong && (
                        <div style={{marginBottom: '3%'}}>
                            <h2 style={{marginLeft: '2%', marginTop: '3%', fontSize: '16px', fontWeight: 'bold'}}>Now playing</h2>
                            <YourPlayListSong 
                                key={current._id} 
                                song={current} 
                                index={1}
                                isQueue={true}
                            />
                        </div>
                    )}

                    {shouldRenderNextSongs && (
                        <div style={{marginBottom: '3%'}}>
                            <h2 style={{marginLeft: '2%', marginTop: '3%', fontSize: '16px', fontWeight: 'bold'}}>Next up</h2>
                            {queueWithoutCurrent.map((song, index) => (
                                <YourPlayListSong 
                                    key={song._id} 
                                    song={song} 
                                    index={index + 1}
                                    isQueue={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Queue;
