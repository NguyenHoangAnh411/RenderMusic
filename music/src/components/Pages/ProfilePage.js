import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar";

function Profile() {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [update, setUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user for the first time
    useEffect(() => {
        handleFetchUser();
    }, []);

    const handleFetchUser = async () => {
        axios
            .get("http://localhost:5014/api/users/", { headers: { Authorization: token } })
            .then((response) => {
                const res = response.data;
                setUser(res.data);
                setName(res.data.name);
                setEmail(res.data.email);
                setUsername(res.data.username);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleChangeName = (value) => {
        setName(value);
        setUpdated(true);
    };

    const handleChangeEmail = (value) => {
        setEmail(value);
        setUpdated(true);
    };

    const handleChangeUsername = (value) => {
        setUsername(value);
        setUpdated(true);
    };

    const handleChangeImg = async (file) => {
        setImage(file);
        setUrl(URL.createObjectURL(file));
        setUpdated(true);
    };

    const handleCancelUpdate = () => {
        setName(user.name);
        setEmail(user.email);
        setUsername(user.username);
        setUpdated(false);
        setUrl(null);
    };

    const handleUpdate = () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("file", image);

        axios
            .patch("http://localhost:5014/api/users/", formData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                const res = response.data;
                if (res.code === 0) {
                    navigate('/logout');
                    setUpdated(false);
                } else {
                    setError(res.message);
                }
                setLoading(false);
                setUpdated(false);
            })
            .catch((error) => {
                setLoading(false);
                setUpdated(false);
                setError(error.message);
            });
    };

    return (
        <Fragment>
            <Navbar/>
            <div style={{  backgroundColor: 'grey', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                
                <div style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px 5px 0 0' }}>
                    <h4 style={{textAlign: 'center', fontWeight: 'bolder'}}>Profile Information</h4>
                </div>
                <div style={{ padding: '20px' }}>
                    <div className="mt-2">
                        <div className="row p-5 ">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', border: '1px solid #007bff', padding: '20px', backgroundColor: '#fff' }}>
                                <label style={{ marginBottom: '20px', textAlign: 'center' }} htmlFor="fileInput">
                                    <img
                                        src={url ? url : user.image}
                                        alt="Avatar"
                                        style={{ width: '150px', height: '150px', cursor: 'pointer', borderRadius: '50%' }}
                                    />
                                    <input
                                        id="fileInput"
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleChangeImg(e.target.files[0])}
                                    />
                                </label>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ cursor: 'pointer', color: 'black' }} onClick={() => document.getElementById('fileInput').click()}>
                                        Update avatar <i className="fa-solid fa-pen-to-square"></i>
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginTop: '3%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '10px', marginLeft: '20px', width: '100%' }}>
                                    <span style={{ padding: '5px', marginRight: '10px' }}>Name: </span>
                                    <input
                                        value={name}
                                        onChange={(e) => handleChangeName(e.target.value)}
                                        style={{ padding: '5px', border: '1px solid #ced4da', borderRadius: '5px', width: '100%', color: '#000' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '10px', marginLeft: '20px', width: '100%' }}>
                                    <span style={{ padding: '5px', marginRight: '10px' }}>Username: </span>
                                    <input
                                        value={username}
                                        onChange={(e) => handleChangeUsername(e.target.value)}
                                        style={{ padding: '5px', border: '1px solid #ced4da', borderRadius: '5px', width: '100%', color: '#000' }}
                                    />
                                </div>
                                <div style={{ marginLeft: '20px', width: '100%' }}>
                                    <span style={{ padding: '5px', marginRight: '10px' }}>Email: </span>
                                    <input
                                        value={email}
                                        onChange={(e) => handleChangeEmail(e.target.value)}
                                        style={{ padding: '5px', border: '1px solid #ced4da', borderRadius: '5px', width: '100%', color: '#000' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {update && (
                    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '0 0 5px 5px', padding: '20px' }}>
                        <div className="row">
                            <div className="col">
                            </div>
                            <div className="col-auto">
                                <button
                                    type="button"
                                    style={{ marginRight: '30px', marginTop: '10px', backgroundColor: '#ffc107', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: '50%' }}
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    style={{ marginLeft: '30px', marginTop: '10px', backgroundColor: '#007bff', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', width: '40%' }}
                                    onClick={handleCancelUpdate}
                                    disabled={loading}
                                >
                                    <i className="fa-solid fa-ban" style={{ marginRight: '5px' }}></i>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div style={{ backgroundColor: '#dc3545', color: '#fff', borderRadius: '5px', padding: '10px', display: 'inline-block' }}>
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default Profile;
