const mongoose = require('mongoose');
require('dotenv').config();
const schedule = require('node-schedule'); // Import thư viện lên lịch trình
const User = require('./server/user_service/UserModel'); // Import model User
const jwt = require('jsonwebtoken'); // Import thư viện để giải mã token

// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});

// Khởi động ứng dụng UrPlaylist trên cổng riêng biệt
const urPlaylistApp = require('./server/urplaylist_service/UrPlayListApp');
const urPlaylistPort = process.env.URPLAYLIST_PORT || 5011;
urPlaylistApp.listen(urPlaylistPort, () => {
    console.log(`UrPlaylist service running on port ${urPlaylistPort}`);
});

// Khởi động ứng dụng Song trên cổng riêng biệt
const songApp = require('./server/song_service/songApp');
const songPort = process.env.SONG_PORT || 5012;
songApp.listen(songPort, () => {
    console.log(`Song service running on port ${songPort}`);
});

// Khởi động ứng dụng Playlist trên cổng riêng biệt
const playlistApp = require('./server/Playlist_service/PlaylistApp');
const playlistPort = process.env.PLAYLIST_PORT || 5013;
playlistApp.listen(playlistPort, () => {
    console.log(`Playlist service running on port ${playlistPort}`);
});

// Khởi động ứng dụng User trên cổng riêng biệt
const userApp = require('./server/user_service/userApp');
const userPort = process.env.USER_PORT || 5014;
userApp.listen(userPort, () => {
    console.log(`User service running on port ${userPort}`);
});

const authApp = require('./server/auth_service/authApp');
const authPort = process.env.AUTH_PORT || 5015;
authApp.listen(authPort, () => {
    console.log(`Auth service running on port ${authPort}`);
});

const job = schedule.scheduleJob('0 0 * * *', async () => {
    try {
        const currentDate = new Date();

        const usersToUpdate = await User.find({ isPremium: true, premiumExpiration: { $lte: currentDate } });

        for (const user of usersToUpdate) {
            user.isPremium = false;
            await user.save();
        }

        console.log('Đã cập nhật trạng thái isPremium cho các người dùng đã hết hạn.');
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái isPremium:', error);
    }
});
