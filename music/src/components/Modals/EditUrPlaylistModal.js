import React, { useState } from 'react';
    import './css/EditUrPlaylistModal.css';
    import { imageDb } from '../../firebaseConfig/Config';
    import { ref, uploadBytes } from 'firebase/storage';
    import { v4 } from 'uuid';

    function EditUrPlaylistModal({ isOpen, onClose, playlist, updateImg, updateName, updateDes }) {
    const [newImage, setNewImage] = useState(playlist ? playlist.image_path : '');
    const [newTitle, setNewTitle] = useState(playlist ? playlist.name : '');
    const [newDescription, setNewDescription] = useState(playlist ? playlist.description : '');

    const handleChangeImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
        const imageBase64 = reader.result;
        setNewImage(imageBase64);
        setImg(file);
        };

        if (file) {
        reader.readAsDataURL(file);
        }
    };

    const handleChangeTitle = (event) => {
        setNewTitle(event.target.value);
    };

    const handleChangeDescription = (event) => {
        setNewDescription(event.target.value);
    };

    const handleSaveChanges = () => {
        if (img) {
          const imgRef = ref(imageDb, `${playlist._id}/${v4()}`);

          uploadBytes(imgRef, img).then(() => {
            const imagePath = `https://firebasestorage.googleapis.com/v0/b/${imageDb.app.options.storageBucket}/o/${encodeURIComponent(imgRef.fullPath)}?alt=media`;
                updateImg(playlist._id, imagePath);
          }).catch((error) => {
            console.error('Error uploading image:', error);
          });
        }

        updateName(playlist._id, newTitle);
        updateDes(playlist._id, newDescription);

        onClose();
    };
    

    const [img, setImg] = useState('');

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Edit Playlist</h2>
                <span className="close" onClick={onClose}>&times;</span>
            </div>

            <form encType="multipart/form-data">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5%', alignItems: 'center' }}>
                <label htmlFor="file" style={{ cursor: 'pointer' }}>
                <img className='img' src={newImage} alt="Playlist Image" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
                <input type="file" id="file" accept="image/*" style={{ display: 'none' }} onChange={handleChangeImage} />
                </label>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <label htmlFor="name">Title:</label>
                    <input type="text" id="name" value={newTitle} onChange={handleChangeTitle} />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={newDescription} onChange={handleChangeDescription} />
                </div>
                </div>
            </div>

            <div style={{ margin: 'auto' }}>
                <button type="button" className='button' onClick={handleSaveChanges}>Save Changes</button>
            </div>
            </form>
        </div>
        </div>
    );
    }

    export default EditUrPlaylistModal;