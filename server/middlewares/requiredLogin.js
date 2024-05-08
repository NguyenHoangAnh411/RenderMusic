const jwt = require('jsonwebtoken');
const User = require('../user_service/UserModel');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SESSION_KEY);
        const user = await User.findById(decodedToken.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};
