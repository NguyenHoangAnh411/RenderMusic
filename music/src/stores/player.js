import { createSlice } from '@reduxjs/toolkit';

const lastPlayedSong = JSON.parse(localStorage.getItem('currentSong'));

const initialState = {
    current: lastPlayedSong || null,
    controls: false,
    playing: false,
    sidebar: false,
    playlistId: null,
    queuePlaylistSong: [],
    showQueue: false,
    shuffle: false,
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setCurrent: (state, action) => {
            const { payload } = action;
            if (payload && payload.id) {
                const isCurrentSong = state.current?.id === payload.id;
                if (isCurrentSong) {
                    state.playing = !state.playing;
                } else {
                    state.current = payload;
                    localStorage.setItem('currentSong', JSON.stringify(payload));
                    state.playing = true;
                    state.playlistId = payload.playlistId;
                    console.log('Playlist ID: ' + payload.playlistId)
                }
            } else {
                console.error('Invalid payload:', payload);
            }
        },
        setControls: (state, action) => {
            const { isPlaying } = action.payload;
            state.controls = { ...state.controls, isPlaying };
            localStorage.setItem('controls', JSON.stringify({ isPlaying }));
        },
        
        
        setPlaying: (state, action) => {
            state.playing = action.payload;
        },
        setSidebar: (state, action) => {
            state.sidebar = action.payload;
        },
        togglePlaying: (state) => {
            state.playing = !state.playing;
        },
        setQueuePlaylistSong: (state, action) => {
            state.queuePlaylistSong = action.payload;
            console.log('queuePlaylistSong:', action.payload);
        },
        setShowQueue: (state, action) => { 
            state.showQueue = action.payload;
        },
        toggleShuffle: (state) => {
            state.shuffle = !state.shuffle;
        },
    },
});

export const { setCurrent, setControls, setPlaying, setSidebar, togglePlaying, setQueuePlaylistSong, setShowQueue, toggleShuffle } = playerSlice.actions;

export default playerSlice.reducer;
