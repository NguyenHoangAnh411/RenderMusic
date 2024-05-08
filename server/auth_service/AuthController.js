const User = require('../user_service/UserModel');
const package = require('../middlewares/package');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/gmailSender');
const hashPassword = require('../services/hash256');
require("dotenv").config();
module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Kiểm tra đầu vào
            if (!username || !password) {
                return res.json(package(1, "Missing required fields", null));
            }

            // Tìm người dùng với email đã cho
            const user = await User.findOne({ username });

            if (!user) {
                // Nếu không tìm thấy người dùng
                return res.json(package(4, "Invalid email or password", null));
            }

            // Kiểm tra mật khẩu
            const isPasswordMatch = hashPassword(password, process.env.SECRET_SALT) === user.password;

            if (!isPasswordMatch) {
                // Nếu mật khẩu không khớp
                return res.json(package(4, "Invalid email or password", null));
            }

            const tokenPayload = {
                userId: user._id,
                image: user.image,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                premiumExpiration: user.premiumExpiration,
            };
            
            const token = jwt.sign(tokenPayload, process.env.SESSION_KEY, { expiresIn: '24h' });
            

            return res.json(package(0, "Login successful", { token }));
        } catch (err) {
            // Xử lý lỗi
            return res.json(package(11, "The request was failed", err.message));
        }
    },
    sendEmailForgetPassword: async (req, res) => {
        try {
            const { email } = req.body;
    
            // Kiểm tra định dạng email
            const regex = /\S+@\S+\.\S+/;
            if (!regex.test(email)) {
                return res.json(package(2, "Invalid email format", null));
            }
    
            if (!email) {
                return res.json(package(1, "Missing required fields", null));
            }
    
            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findOne({ email });
            const findUser = await User.findOne({ email }).lean();
            if (!user) {
                return res.json(package(20, "Email does not exist", null));
            }
    
            // Tạo mật khẩu mới ngẫu nhiên
            const newPassword = generateRandomPassword();
    
            // Mã hóa mật khẩu mới
            const hashedPassword = hashPassword(newPassword, process.env.SECRET_SALT);
    

            const token = jwt.sign({ ...findUser }, process.env.SESSION_KEY, { expiresIn: '1m' });
            // Cập nhật mật khẩu mới vào cơ sở dữ liệu
            user.password = hashedPassword;
            await user.save();
    
            // Gửi email chứa mật khẩu mới
            const loginLink = `${process.env.SERVER_ADDRESS}/direct?token=${token}`;
            await sendEmail(email, "Login Link", `Your new password is: ${newPassword}. Click the following link to log in: ${loginLink}`);
    
            return res.json(package(0, "Email sent successfully", null));
        } catch (err) {
            console.error(err);
            return res.json(package(11, "Failed to send email", err.message));
        }
    },
    directLogin: async (req, res) =>{
        try{
            const token = req.body.token;
            if (!token) {
                return res.json(package(1, "Missing required fields", null));
            }

            const user_jwt = jwt.verify(token, process.env.SESSION_KEY);
            if(user_jwt){
                const user = await User.findOne({ username: user_jwt.username }).lean();
                if (!user) {
                    return res.json(package(10, "Invalid username", null));
                }
                delete user.password;

                user.token = jwt.sign(user, process.env.SESSION_KEY , { expiresIn: '1h' });

                
                return res.json(
                    package(0, "Login success", user)
                );
            }else{
                return res.json(package(403, "This token was not valid or expired", null));
            }
        }
        catch(error){
            return res.json(package(403, "This token was not valid or expired", error.message));
        }
    },
};


const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
};