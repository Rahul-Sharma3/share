const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        socket.to(roomCode).emit('user-connected', socket.id);
        console.log(`User ${socket.id} joined room ${roomCode}`);
    });

    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', {
            signal: data.signal,
            from: socket.id,
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
