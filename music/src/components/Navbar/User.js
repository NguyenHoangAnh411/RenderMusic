import React, { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { Icon } from '../Icons';
import { decodeToken } from './Auth/decodeToken';
import { useNavigate } from 'react-router-dom';

export default function User() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const checkLocalStorage = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true); 
                const decodedUserInfo = decodeToken(token);
                setUserInfo(decodedUserInfo);
            }
        };

        checkLocalStorage();
    }, []); 

    const handleLoginSuccess = (userInfo) => {
        setIsLoggedIn(true);
        setUserInfo(userInfo);

    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserInfo(null);

        navigate('/');
    };

    const handleActivatePremium = () => {
        navigate('/qr-code'); 
    };


    const userDisplay = userInfo ? (
        <div className="flex items-center">
            <img className='w-[28px] h-[28px] rounded-full' src={userInfo.image} alt="User Avatar" />
            <span className='text-sm font-semibold'>{userInfo.name}</span>
            <div>
                {userInfo.isPremium ? (
                    <button className="text-sm font-semibold" style={{ marginLeft: '10px', color: 'green' }}>Premium</button>
                ) : null}
            </div>
        </div>
    ) : (
        <span className='text-sm font-semibold' style={{padding: '5px', marginLeft: '15px'}}>Login/Register</span>
    );
    
    

    return (
        <>
        
            <Menu as="nav" className={"relative"}>
                {({open}) => (
                    <>
                        <Menu.Button className={`flex items-center gap-x-[6px] rounded-[23px] p-1 ${open ? 'bg-active' : 'bg-brenk'}`}>
                            
                            {userDisplay}
                            <span className={open === true && 'rotate-180'}>
                                <Icon name="dir" />
                            </span>
                        </Menu.Button>
                        <Menu.Items className="absolute p-1 top-full right-0 w-48 bg-active rounded translate-y-2 z-10">
                            {isLoggedIn ? (
                                <>
                                    {!userInfo.isPremium && ( 
                                        <Menu.Item>
                                            <button className="h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center bg-menubg" onClick={handleActivatePremium}>
                                                Activate Premium
                                            </button>
                                        </Menu.Item>
                                    )}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}
                                                href="/profile"
                                                
                                            >
                                                Profile
                                                <Icon name="external" />
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}
                                                href="/change-password"
                                            >
                                                Change Password
                                                
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}
                                                href="/logout"
                                            >
                                                Log out
                                            </a>
                                        )}
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}
                                                href='/login'
                                                onClick={() => navigate('/login', { state: { onLoginSuccess: handleLoginSuccess } })}
                                            >
                                                Login
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                className={`h-10 flex px-2 text-sm font-semibold justify-between text-white opacity-80 items-center ${active && 'bg-menubg'}`}
                                                href="/register"
                                            >
                                                Register
                                            </a>
                                        )}
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Items>
                    </>
                )}
            </Menu>
        </>
    );
}
