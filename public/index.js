$(document).ready(() => {
    const socket = io.connect();
    let currentUser;
    socket.emit('get online users');
    socket.emit('fetch channels');
    socket.emit('user changed channel', "General");
    $(document).on('click', '.channel', (e) => {
        let newChannel = e.target.textContent;
        socket.emit('user changed channel', newChannel);
    });

    $('#create-user-btn').click((e) => {
        e.preventDefault();
        const usernameInput = $('#username-input').val();
        if (usernameInput.length > 0) {
            const sanitizedUsername = DOMPurify.sanitize(usernameInput);
            socket.emit('new user', sanitizedUsername);
            currentUser = sanitizedUsername;
            $('.username-form').remove();
            $('.main-container').css('display', 'flex');
        }
    });
    $('#send-chat-btn').click((e) => {
        e.preventDefault();
        let channel = $('.channel-current').text();
        let message = $('#chat-input').val();
        if (message.length > 0) {
            socket.emit('new message', {
                sender: currentUser,
                message: message,
                channel: channel
            });
            $('#chat-input').val("");
        }
    });
    $('#new-channel-btn').click(() => {
        let newChannel = $('#new-channel-input').val();

        if (newChannel.length > 0) {
            socket.emit('new channel', newChannel);
            $('#new-channel-input').val("");
        }
    });

    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat`);
        $('.users-online').append(`<div class="user-online">${username}</div>`);
    })
    socket.on('new message', (data) => {
        let currentChannel = $('.channel-current').text();
        if (currentChannel == data.channel) {
            $('.message-container').append(`
            <div class="message">
                <p class="message-user">${data.sender}: </p>
                <p class="message-text">${data.message}</p>
            </div>
            `);
        }
    });
    socket.on('get online users', (onlineUsers) => {
        for (username in onlineUsers) {
            $('.users-online').append(`<div class="user-online">${username}</div>`);
        }
    });
    socket.on('user has left', (onlineUsers) => {
        $('.users-online').empty();
        for (username in onlineUsers) {
            $('.users-online').append(`<p>${username}</p>`);
        }
    });
    socket.on('new channel', (newChannel) => {
        $('.channels').append(`<div class="channel">${newChannel}</div>`);
    });
    socket.on('user changed channel', (data) => {
        $('.channel-current').addClass('channel');
        $('.channel-current').removeClass('channel-current');
        $(`.channel:contains('${data.channel}')`).addClass('channel-current');
        $('.channel-current').removeClass('channel');
        $('.message').remove();
        data.messages.forEach((message) => {
            $('.message-container').append(`
            <div class="message">
              <p class="message-user">${message.sender}: </p>
              <p class="message-text">${message.message}</p>
            </div>
          `);
        });
    });
    socket.on('fetch channels', (channels) => {
        for (channel in channels) {
            $('.channels').append(`<div class="channel">${channel}</div>`);
        }
    });
});