import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in .env');
  try {
    await mongoose.connect(uri, {
      // mongoose 7+ has sensible defaults; options kept minimal
    });
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}
