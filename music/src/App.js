import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Bottombar from './components/Bottombar.js';
import Header from './components/Header.js';
import Content from './components/Content.js';
import Playlist from './views/Playlist.js';
import Search from './views/Search.js'
import Collection from './views/Collection.js';
import Lyric from './views/Lyric.js';
import LoginModal from './components/Pages/LoginPage.jsx';
import RegisterPage from './components/Pages/RegisterPage.js';
import ProfilePage from './components/Pages/ProfilePage.js';
import ChangePassword from './components/Pages/ChangePasswordPage.jsx';
import ForgetPassword from './components/Pages/ForgetPasswordPage.jsx'
import Logout from './components/Pages/Logout.js';
import YourPlayList from './views/YourPlayList.js';
import './App.css'
import LikedSong from './views/LikedSongs.js';
import Home from './views/Home.js';
import DirectLogin from './components/Pages/DirecLogin.jsx';
import QRCode from './components/Pages/QRCode.jsx';
function App() {
  return (
    <Router  className='App-header'>
      <div style={{margin: '10px', overflow: 'hidden', backgroundColor: 'black'}} className='wrapper'>
        <Header />
          <div style={{width: '100%', backgroundColor: '#212121', overflowY: 'auto', borderRadius: '10px', padding: '10px'}}>
            <Routes style={{backgroundColor: 'blue'}}>
              <Route path="/direct" element={<DirectLogin />} />
              <Route path="/" element={<Home />} />
              <Route path="/qr-code" element={<QRCode />} />
              <Route path="/login" element={<LoginModal />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
              <Route path="/search" element={<Search />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/lyric" element={<Lyric />} />
              <Route path="/yourplaylist/:urplaylistId" element={<YourPlayList />} />
              <Route path="/likedSongs" element={<LikedSong />} />
            
            </Routes>
          </div>
          

      </div>
      <Bottombar />
    </Router>
  );
}

export default App;