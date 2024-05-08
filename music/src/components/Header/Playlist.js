import React, { useState, useEffect } from "react";
import axios from 'axios';
import PlaylistShow from '../YourPlaylist';

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5011/api/yourplaylists/', {
        headers: {
          Authorization: token,
        },
      });
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    const intervalId = setInterval(fetchPlaylists, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="flex">
      <ul>
        {playlists.map(playlist => (
          <PlaylistShow key={playlist._id} playlist={playlist} />
        ))}
      </ul>
    </nav>
  );
}
