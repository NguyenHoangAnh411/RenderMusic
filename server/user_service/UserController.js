const User = require('./UserModel');
const Song = require('../song_service/SongModel');
const package = require('../middlewares/package');
const jwt = require('jsonwebtoken');
const uploadFile = require('../services/uploadFirebase');
const dateTime = require('../services/getCurrentTime');
const hashPassword = require('../services/hash256');

module.exports = {
    register: async (req, res) => {
        try{
            const {username, password, email, name} = req.body;

        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            return res.json(package(2, "Invalid email format", null));
        }
        
        if (!name || !email || !password || !username) {
            return res.json(package(1, "Missing required fields", null));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json(package(9, "Email already exists", null));
        }

        const hashedPassword = hashPassword(password, process.env.SECRET_SALT);

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 1);
        const preUser = {
            username: username,
            name: name,
            email: email,
            password: hashedPassword,
            image: process.env.DEFAULT_AVATAR,
            role: 'User',
            status: "InActive",
            isPremium: false,
            premiumExpiration: expirationDate,
        }
        const newUser = new User(preUser);

            const result = await newUser.save();

            return res.json(package(0, "Registration success", newUser));
        }
        catch (err) {
            return res.json(package(11, "The request was failed", err.message));
        }
    },
    getProfile: async (req, res) =>{
        try{
            const token = req.header('Authorization');
            const username = extractUsernameFromToken(token);

            if (!username) {
                return res.json(package(9, "Invalid or expired token", null));   
            }

            const user = await User.findOne({ username }).lean();

            if (!user) {
                return res.json(package(10, "Account does not exist", null));
                
            }

            delete user.password;

            res.json(package(0, "Get user information successfully", user));

        }catch(error){
            return res.json(package(11, "Internal error", error.message));
        }
    },
    updateProfile: async (req, res) =>{
        try {
            const { username, name, email } = req.body;
            const image = req.file;

            if(!username || !name){
                return res.send(
                    package(400, "Missing required parameters", null)
                );
            }
    
            // Find the user by username
            const user = await User.findOne({ username }).lean();
            let _id = user._id;

            if (!user) {
                return res.send(
                    package(404, "User not found", null)
                );
            }

            let result;
            if(image){
                const uploadImage = await uploadFile(image);
                const url = uploadImage.data;
                result = await User.findByIdAndUpdate({ _id }, { username, name, image: url, email }, { new: true });
            }else{
                result = await User.findByIdAndUpdate({ _id }, { username, name, email }, { new: true });
            }
            

            return res.send(package(0, "Update profile successfully.", result));
        } catch (error) {
            console.log(error);
            return res.send(package(500, "Error updating profile.", error.message));
        }
    },
    changePassword: async (req, res) =>{
        try{
            const token = req.header('Authorization');
            const username = extractUsernameFromToken(token);

            if (!username) {
                return res.json(package(9, "Invalid or expired token", null));
                
            }
    
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;
            const confirmPassword = req.body.confirmPassword;
    
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.json(package(7, "Please provide complete information.", null));
                
            }

            const userDB = await User.findOne({ username });

            if (!userDB) {
                return res.json(package(10, "Account does not exist", null));
                
            }

            if (hashPassword(currentPassword, process.env.SECRET_SALT) !== userDB.password) {
                return res.json(package(10, "Current password is incorrect", null));
                
            }

            if (newPassword !== confirmPassword) {
                return res.json(package(8, "Confirm password does not match", null));
                
            }

            userDB.password = hashPassword(newPassword, process.env.SECRET_SALT);
            const result = await userDB.save();

            return res.json(package(0, "Password changed successfully", result));

        }catch(error){
            return res.json(package(11, "Internal error", error.message));
        }
    },
    checkSongExist: async (req, res) => {
        try {
            const currentUser = req.user;
    
            if (!currentUser) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
    
            const { songId } = req.params;
    
            const user = await User.findById(currentUser._id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const songIndex = user.likedSongs.findIndex(song => song.songId.toString() === songId);
    
            if (songIndex === -1) {
                return res.json({ exists: false });
            } else {
                return res.json({ exists: true });
            }
        } catch (error) {
            console.error('Error checking song in playlist:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    addLikeSong: async (req, res) => {
        try {
            const currentUser = req.user;
    
            const { songId } = req.params;
    
            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ error: 'Song not found' });
            }
    
            const alreadyLiked = currentUser.likedSongs.some(likedSong => likedSong.songId === songId);
    
            if (alreadyLiked) {
                return res.status(400).json({ error: 'Song already liked' });
            }
    
            const likeInfo = {
                songId: songId,
                likedAt: new Date()
            };
    
            currentUser.likedSongs.push(likeInfo);
    
            await currentUser.save();
    
            return res.status(201).json({ message: 'Liked song added successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    unlikeSong: async (req, res) => {
        try {
            const currentUser = req.user;
    
            const { songId } = req.params;
    
            const user = await User.findById(currentUser._id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Tìm index của bài hát trong mảng likedSongs của người dùng
            const songIndex = user.likedSongs.findIndex(song => song.songId.toString() === songId);
    
            if (songIndex === -1) {
                return res.status(404).json({ error: 'Song not found in likedSongs' });
            }
    
            // Loại bỏ bài hát khỏi mảng likedSongs
            user.likedSongs.splice(songIndex, 1);
    
            await user.save();
    
            return res.status(200).json({ message: 'Song unliked successfully' });
        } catch (error) {
            console.error('Error unliking song:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getLikedSongs: async (req, res) => {
        try {
            const currentUser = req.user;
    
            if (!currentUser) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
    
            const user = await User.findById(currentUser._id);
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const likedSongsWithDate = user.likedSongs.map(song => ({
                songId: song.songId,
                likedAt: song.likedAt,
            }));
    
            const likedSongIds = likedSongsWithDate.map(song => song.songId);
    
            const likedSongs = await Song.find({ _id: { $in: likedSongIds } });
    
            return res.status(200).json({ 
                likedSongs: likedSongs,
                likedAt: likedSongsWithDate.map(song => song.likedAt)
            });
        } catch (error) {
            console.error('Error getting liked songs:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    activatePremium30Days: async (req, res) => {
        try {
            // Lấy token từ request header Authorization
            const token = req.header('Authorization');
    
            // Trích xuất username từ token
            const username = extractUsernameFromToken(token);
    
            // Kiểm tra xem username có tồn tại không
            if (!username) {
                return res.json(package(9, "Invalid or expired token", null));
            }
    
            // Tìm user trong cơ sở dữ liệu bằng username
            const user = await User.findOne({ username });
    
            // Kiểm tra xem user có tồn tại không
            if (!user) {
                return res.json(package(10, "User does not exist", null));
            }
    
            // Kiểm tra xem user đã có tài khoản premium chưa
            if (user.isPremium) {
                return res.json(package(10, "User already has premium account", null));
            }
    
            // Tính toán thời gian hết hạn là sau 30 ngày
            const premiumExpiration = new Date();
            premiumExpiration.setDate(premiumExpiration.getDate() + 30);
    
            // Cập nhật thông tin tài khoản premium và thời gian hết hạn
            user.isPremium = true;
            user.premiumExpiration = premiumExpiration;
    
            // Lưu thay đổi vào cơ sở dữ liệu
            await user.save();
    
            // Trả về kết quả thành công
            return res.json(package(0, "Activated premium account for 30 days successfully", null));
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error activating premium account for 30 days:', error);
            return res.json(package(11, "Internal error", error.message));
        }
    }
    
    

}

function extractUsernameFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.SESSION_KEY);
        return decoded.username;
    } catch (error) {
        console.error('Error extracting username from token:', error);
        return null;
    }
}