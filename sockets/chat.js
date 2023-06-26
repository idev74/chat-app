module.exports = (io, socket, onlineUsers) => {
    socket.on('new user', (username) => {
        onlineUsers.username = socket.id;
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
    })
    socket.on('new message', (data) => {
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new message', data);
    })
    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    })
    socket.on('disconnect', () => {
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers);
      });
}