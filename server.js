import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.config.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import commentRoute from './routes/comment.route.js'
import likeRoute from './routes/like.route.js'
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.port || 8081;
app.get('/', (req, res) => {
    res.send("working hai kya")
});
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);
app.use('/api/like-unlike', likeRoute);
app.listen(port, () => {
    console.log(`working on http://localhost:${port}`)
})
