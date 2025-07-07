import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongodb_uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if failed to connect
  }
};

export default connectDB;
