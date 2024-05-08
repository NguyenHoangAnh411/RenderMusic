import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import Navbar from '../Navbar';
import './Login.css';

function LoginPage({ onLoginSuccess }) {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            setError('Please enter username and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5015/api/auth/login', {
                username: username,
                password: password,
            });

            localStorage.setItem('token', response.data.data.token);

            // Điều hướng về trang chính và gọi hàm onLoginSuccess
            navigate('/');
            onLoginSuccess(response.data.data.userInfo);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Network Error');
            }
        }
    };

    return (
        <div style={{width: '100%'}}>
            <Navbar />
            <div>
                <div>
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body text-dark">
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label " style={{color: 'black', }}>Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Enter username"
                                        value={username}
                                        style={{backgroundColor: 'white', border: '1px solid black', color: 'black'}}
                                        onChange={handleUsernameChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="password" className="form-label" style={{color: 'black'}}>Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        style={{backgroundColor: 'white', border: '1px solid black', padding: '8px'}}
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div class="d-grid gap-2">
                                <button style={{width: '100%'}} onClick={handleSubmit} className="btn btn-dark">Login</button>
                                </div>
                                
                                <div style={{marginTop: '5%'}} className="text-end">
                                    <a href='/register' style={{color: 'blue'}}>Don't have an account?</a> or
                                    <a href='/forget-password' style={{color: 'blue'}}> Forgot password?</a>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
