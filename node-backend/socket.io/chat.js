const rooms = []; // TODO: Replace this with redis database

const activeUsers = {}; // Users which have subscribed to new chats

const Chat = require('../controllers/Chat');
const Friend = require('../controllers/Friend');

module.exports = function (io, socket) {
    socket.on('subscribeToChats', function (data) {
        console.log('Subscribe to chats', socket.user.id);
        activeUsers[socket.user.id] = socket.id;
    });

    socket.on('/chat/user', function (data) {
        if (data.userId) {
            // Check if socket.user.id is friend with data.userId
            Friend.findByUserId(socket.user.id)
            .then(friends => {
                if(friends.filter(friend => friend.id === data.userId).length > 0) {
                    // user is a friend of this socket
                    const roomName = (socket.user.id < data.userId ? socket.user.id+'USERCHAT'+data.userId : data.userId+'USERCHAT'+socket.user.id);
                    if (!rooms.includes(roomName)) {
                        rooms.push(roomName);
                    }
                    socket.join(roomName);
                    socket.emit('chatJoined', roomName);
                    console.log(socket.user.first_name, 'joined chat room', roomName);
                }  else {
                    socket.emit('new error', 'You are not allowed to send message to this user.');
                }
            })
            .catch(err => {
                socket.emit('new error', 'chat join body is invalid.');
            });
        } else {
            socket.emit('new error', 'chat join body is invalid.');
        }
    });

    socket.on('new message', function (data) {
        console.log('New message', data);
        if (data.to && data.message && data.roomName) {
            // Required data values is supplied
            if(Object.keys(socket.rooms).indexOf(data.roomName) >= 0) {
                // User is in the room it want's to send to
                // Notify receiver that a user sent them a message (if they aren't in the room)
                const roomClients = io.sockets.adapter.rooms[data.roomName].sockets;
                console.log(roomClients);
                const receiverId = activeUsers[data.to];
                if (receiverId && Object.keys(roomClients).indexOf(receiverId) === -1) {
                    io.to(receiverId).emit('newChat', {id: socket.user.id});
                }
                // Save chat message to db
                Chat.save(socket.user.id, data.to, data.message)
                .then(ids => {
                    // Emit message to all users in the room
                    io.in(data.roomName).emit('new message', {
                        from_user_id: socket.user.id,
                        to_user_id: data.to,
                        message: data.message,
                        created_at: Date.now(),
                        id: ids[0] // Id of message from db
                    });

                })
                .catch(err => {
                    socket.emit('new error', 'Unable to send chat message.');
                    console.error(err);
                })
            } else {
                socket.emit('new error', 'You are not allowed to send message to this person.');
            }
        } else {
            socket.emit('new error', 'new message body is invalid.');
        }
    });
}