import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Please log in first.');
                return;
            }

            const response = await axios.post('http://localhost:5014/api/users/change-password', {
                currentPassword,
                newPassword,
                confirmPassword,
            }, {
                headers: {
                    Authorization: token
                }
            });

            const { code, message } = response.data;

            if (code === 0) {
                setMessage(message);
                window.alert('Password changed successfully');
                navigate('/');
            } else {
                setMessage(message);
            }
        } catch (error) {
            console.log(error);
            setMessage('An error occurred');
        }
    };

    return (
        <div>
            <Navbar/>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  overflow: 'hidden', marginTop: '30px' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#2F4F4F', borderRadius: '5px', padding: '40px', display: 'flex', marginBottom: 'auto',  }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="currentPassword" style={{ color: 'white' }}>Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="newPassword" style={{ color: 'white' }}>New Password: </label>
                    <input
                        type="password"
                        id="newPassword"
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="confirmPassword" style={{ color: 'white' }}>Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', color: 'black' }}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </div>
                <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Change Password</button>
                {message && (
                    <div style={{ marginTop: '10px' }} className={message.startsWith('Success') ? 'alert alert-success' : 'alert alert-danger'}>
                        {message}
                    </div>
                )}
            </form>
        </div>
        </div>
        
    );
}

export default ChangePassword;
