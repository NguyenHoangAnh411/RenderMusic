import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import Navbar from '../Navbar';

function RegisterPage() {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !email || !name) {
            setError('Please enter all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5014/api/users/register', {
                username: username,
                password: password,
                email: email,
                name: name,
            });

            // Điều hướng về trang chính
            alert('Successfully registered! Please log in to try our website')
            navigate('/');
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
                    <div style={{backgroundColor: '#2F4F4F', width: '400px', margin: '50px auto', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
                        <div style={{backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', padding: '10px', borderRadius: '10px 10px 0 0', textAlign: 'center'}}>Register</div>
                        <div style={{padding: '20px 0'}}>
                                <div style={{padding: '20px', display: 'flex', flexDirection:'column', }}>
                                    <label htmlFor="username" style={{color: 'white'}} className="form-label">Username:</label>
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
                                <div style={{padding: '20px', display: 'flex', flexDirection:'column'}}>
                                    <label htmlFor="password" style={{color: 'white'}} className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password"
                                        value={password}
                                        style={{backgroundColor: 'white', border: '1px solid black', padding: '8px', color: 'black'}}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div style={{padding: '20px', display: 'flex', flexDirection:'column'}}>
                                    <label htmlFor="email" style={{color: 'white'}} className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter email"
                                        value={email}
                                        style={{backgroundColor: 'white', border: '1px solid black', padding: '8px', color: 'black'}}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                <div style={{padding: '20px', display: 'flex', flexDirection:'column'}}>
                                    <label htmlFor="name" style={{color: 'white'}} className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        style={{backgroundColor: 'white', border: '1px solid black', color: 'black'}}
                                        onChange={handleNameChange}
                                    />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div class="d-grid gap-2" style={{display: 'flex', justifyContent: 'center'}}>
                                <button style={{width: '80%', backgroundColor: 'green'}} onClick={handleSubmit} className="btn btn-dark">Register</button>
                                </div>
                                
                                <div style={{textAlign: 'end', marginRight: '10px'}}>
                                    <span>Already have an account?</span> 
                                    <a style={{color: 'lightblue'}} href='/login' className='text-primary'> Login here!</a>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
