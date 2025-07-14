import { messageModel } from '../models/message.model.js';

const users = {}; // { userId: socketId }

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`✅ Registered user ${userId} -> ${socket.id}`);
    });

    socket.on('send-message', async ({ senderId, receiverId, message }) => {
      const targetSocketId = users[receiverId];

      // Save to MongoDB
      try {
        const saved = await messageModel.create({
          sender: senderId,
          receiver: receiverId,
          message,
        });

        console.log('💾 Message saved:', saved._id);

        if (targetSocketId) {
          io.to(targetSocketId).emit('receive-message', {
            senderId,
            message,
          });
        }
      } catch (error) {
        console.error('❌ Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};
