module.exports = (io, socket, onlineUsers, channels) => {
    socket.on('new user', (username) => {
        onlineUsers.username = socket.id;
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
    })
    socket.on('new message', (data) => {
        channels[data.channel].push({ sender: data.sender, message: data.message });
        io.to(data.channel).emit('new message', data);
    })
    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    })
    socket.on('disconnect', () => {
        delete onlineUsers[socket.username]
        console.log(`${socket.username} has left!`);
        io.emit('user has left', onlineUsers);
    });
    socket.on('new channel', (newChannel) => {
        channels[newChannel] = [];
        socket.join(newChannel);
        io.emit('new channel', newChannel);
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });
    });
    socket.on('user changed channel', (newChannel) => {
        socket.join(newChannel);
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });
    });
}