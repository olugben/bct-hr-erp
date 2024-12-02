const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '4h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
