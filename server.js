import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.config.js';

import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import likeRoute from './routes/like.route.js';
import { socketHandler } from './sockets/socketHandlers.js'; 

dotenv.config();
connectDB();

const app = express();

// Wrap Express with HTTP for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('working hai kya');
});
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);
app.use('/api/like-unlike', likeRoute);

// ✅ Socket.IO handler
socketHandler(io);

// Server Listen
const port = process.env.PORT || 8081;
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
