const jwt = require('jsonwebtoken');
const config = require('../config');
const socketio = require('socket.io');

module.exports = function (server) {
    const io = socketio(server);
    
    /**
     * Socket.io middleware for checking valid user token
     * @param socket Socket.io socket object
     * @param next 
     */
    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (token) {
            jwt.verify(token, config.jwt.secret, function (err, decoded) {
                if (err) {
                    console.error(err);
                    return next(new Error('Auth error'));
                } else {
                    socket.user = decoded.data;
                    return next();
                }
            });
        } else {
            return next(new Error('Auth error'));
        }
    });
    
    io.on('connection', (socket) => {
        socket.on('join', (data) => {
            console.log('IO Socket joined:', socket.user.first_name, socket.user.last_name, socket.id);
        });
        
        require('./chat')(io, socket);
    });
}