import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import axios from 'axios';
import './css/YourPlaylist.css';
import EditUrPlaylistModal from './Modals/EditUrPlaylistModal';

export default function YourPlaylist({ playlist }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.get('http://localhost:5011/api/yourplaylists/', { headers });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };
  

  useEffect(() => {
    fetchPlaylists();
  }, []);

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

  const handleRightClick = (event, playlistId) => {
    event.preventDefault();
    setSelectedPlaylistId(playlistId);
    setShowMenu(!showMenu);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setShowMenu(false); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditPlaylist = () => {
    setShowMenu(false);
    handleOpenModal();
    console.log('dsadaddasdsa')
  };

  const handleDeletePlaylist = async () => {
    try {
      setShowMenu(false);
  
      await axios.delete(`http://localhost:5011/api/yourplaylists/deleteUrPlaylist/${selectedPlaylistId}`);
  
      const updatedPlaylists = playlists.filter((playlist) => playlist._id !== selectedPlaylistId);
      setPlaylists(updatedPlaylists);
  
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleUpdatePlaylistImage = async (playlistId, newImage) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateImage/${playlistId}`, { image_path: newImage });

      if (response.status === 200) {
        fetchPlaylists();
      } else {
        console.error('Failed to update playlist image');
      }
    } catch (error) {
      console.error('Error updating playlist image:', error);
    }
  };
  
  const handleUpdatePlaylistName = async (playlistId, newName) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateName/${playlistId}`, { name: newName });
  
      if (response.status !== 200) {
        throw new Error('Failed to update playlist name');
      }
  
      fetchPlaylists();
    } catch (error) {
      console.error('Error updating playlist name:', error);
      throw new Error('Failed to update playlist name');
    }
  };
  
  const handleUpdatePlaylistDescription = async (playlistId, newDescription) => {
    try {
      const response = await axios.patch(`http://localhost:5011/api/yourplaylists/updateDescription/${playlistId}`, { description: newDescription });
  
      if (response.status !== 200) {
        throw new Error('Failed to update playlist description');
      }
  
      fetchPlaylists();
    } catch (error) {
      console.error('Error updating playlist description:', error);
      throw new Error('Failed to update playlist description');
    }
  };
  
  

  return (
    <div style={{ position: 'relative',}} ref={menuRef}>
      <NavLink
        to={`/yourplaylist/${playlist._id}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '5px 8px',
          borderRadius: '8px',
          marginBottom: '10px',
          textDecoration: 'none',
          height: '100%'
        }}
        key={playlist._id}
        className={'group'}
        onContextMenu={(event) => handleRightClick(event, playlist._id)}
      >
        <div style={{ flex: 1, marginRight: '24px' }}>
          <img
            className='h-full rounded-md'
            src={playlist.image_path}
            alt={playlist.name}
          />
        </div>
        <div style={{ flex: 3 }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {playlist.name}
          </span>{' '}
          <br />
          <span className='text-sm text-link'>{playlist.description}</span>
        </div>
      </NavLink>
      {showMenu && (
        <Menu as='div' className='playlist-menu'>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleEditPlaylist}
                className={`menu-item ${active ? 'active' : ''}`}
              >
                Edit Playlist
              </button>
            )}
          </Menu.Item>
          <div className='divider'></div>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleDeletePlaylist}
                className={`menu-item ${active ? 'active' : ''}`}
              >
                Delete Playlist
              </button>
            )}
          </Menu.Item>
        </Menu>
      )}
      {isModalOpen && (
        <EditUrPlaylistModal
          updateDes={handleUpdatePlaylistDescription}
          updateName={handleUpdatePlaylistName}
          updateImg={handleUpdatePlaylistImage}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          playlist={playlist}
        />
      )}
    </div>
  );
}
