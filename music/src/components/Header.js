import logo from './image/logo.svg';
import Menu from './Header/Menu';
import { Icon } from './Icons';
import Playlist from './Header/Playlist';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


export default function Header() {


  const handleAddPlaylist = async () => {
    try {
      // Lấy mã token từ local storage
      const token = localStorage.getItem('token');
  
      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error('Token not found');
      }
  
      // Gửi yêu cầu POST với mã token trong header 'Authorization'
      const response = await axios.post(
        'http://localhost:5011/api/yourplaylists/add',
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      console.log('New playlist added:', response.data);
  
      const urplaylistId = response.data._id;

    } catch (error) {
      console.error('Error adding playlist:', error);
    }
  };
  
  

  return (
    <div style={{width: '300px', marginRight: '5px', borderRadius: '10px', backgroundColor: '#2F4F4F', zIndex: '2'}} className="pt-6 flex flex-col flex-shrink-0">
      <a href="/" className='mb-7 px-6' style={{display: 'flex', justifyContent: 'center'}}>
        <img className='h-10 w-auto' style={{minWidth: '100px', minHeight: '100px'}} src='https://firebasestorage.googleapis.com/v0/b/finalsoa-fae05.appspot.com/o/Designer%20(1)%20(1).png?alt=media&token=31403721-cdd4-4197-a68b-a83af571a1f1' alt="Logo" />
      </a>

      <Menu />

      <nav className='mt-8 px-6'>
        <ul>
          <li>
            <div style={{cursor: 'pointer', padding: '10px'}} className="flex items-center gap-x-3 text-sm font-bold text-link hover:text-white transition-colors group" href="/yourplaylist" onClick={handleAddPlaylist}>
              <span className='bg-white p-[6px] bg-opacity-70 group-hover:bg-opacity-90'>
                <Icon name="plus" />
              </span>
              Create Playlist
            </div>
            <NavLink to={'/likedSongs'} style={{ padding: '10px' }} className="flex items-center gap-x-3 text-sm font-bold text-link hover:text-white mt-4 transition-colors group" >
              <span className='bg-gradient-to-r from-gra1 to-gra2 p-[6px] opacity-70 group-hover:opacity-100'>
                <Icon name="menuheart" />
              </span>
              Liked Songs
            </NavLink>

          </li>
        </ul>
        <div className="h-[1px] bg-active mt-5"></div>
      </nav>
      <nav className='px-6 pt-3 overflow-y-auto scrollbar-hide' style={{ overflowY: 'visible', height: '100%' }}>

        <Playlist />
      </nav>
    </div>
  );
}
