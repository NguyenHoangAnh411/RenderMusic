import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import './css/Lyric.css';

export default function Lyric() {

    const currentSong = useSelector(state => state.player.current);
    const [showLyric, setShowLyric] = useState(false);

    const colors = ['#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300'];

    const randomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const backgroundColor = randomColor();

    useEffect(() => {
        console.log('Lyric:', currentSong.lyric);

        if (currentSong.lyric !== null) {
            setShowLyric(true);
        }
    }, [currentSong.lyric]);

    return (
        <div style={{ whiteSpace: 'pre-line', overflowY: 'scroll', width: '100%', backgroundColor, borderRadius: '10px' }}>
            <Navbar/>
            {showLyric ? (
                <div style={{marginBottom: '3%', marginLeft: '3%', fontSize: '40px'}}>
                    <p>
                        {currentSong.lyric.split('\n').map((line, index) => (
                            <span key={index} className="lyric-line">
                                {line}
                            </span>
                        ))}
                    </p>
                </div>
            ) : (
                <div>This song doesn't have lyrics yet</div>
            )}
        </div>
    );
}
