import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QRCodeComponent() {
    const [activated, setActivated] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleQRScanned = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first');
            return;
        }
        axios.post('http://localhost:5014/api/users/activatePremium', {}, {
            headers: {
                Authorization: token 
            }
        })
        .then(response => {
            const packageData = response.data; // Dữ liệu từ package trả về từ API
            if (packageData.code === 0) { // Kiểm tra mã code trong package
                setActivated(true);
                setMessage(packageData.message); // Hiển thị thông báo từ package
                alert('Successfully activated premium! Please log in again to see the changes')
                navigate('/logout');
            } else {
                setMessage(packageData.message); // Hiển thị thông báo lỗi từ package
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setMessage('Error occurred'); // Hiển thị thông báo lỗi khi có lỗi trong quá trình gửi yêu cầu
        });
    };
    
    return (
        <div>
            {activated ? (
                <h2>{message}</h2>
            ) : (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <h2>Scan the QR Code to activate premium</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <QRCode value="http://localhost:3000/home" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="button" onClick={handleQRScanned}>Done</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <h3>{message}</h3>
                </div>
                </>
            )}
        </div>
    );
}

export default QRCodeComponent;
