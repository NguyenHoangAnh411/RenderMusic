import { jwtDecode } from 'jwt-decode';

// Hàm để giải mã token và trích xuất thông tin người dùng
export const decodeToken = (token) => {
    try {
        // Giải mã token
        const decodedToken = jwtDecode(token);
        
        // Trích xuất thông tin người dùng từ payload của token
        const userInfo = {
            userId: decodedToken.userId,
            username: decodedToken.username,
            email: decodedToken.email,
            image: decodedToken.image,
            name: decodedToken.name,
            //Thêm các thông tin khác mà bạn muốn trích xuất từ token
        };
        
        return userInfo;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
