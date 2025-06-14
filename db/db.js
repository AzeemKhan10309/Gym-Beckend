// db.js
import mongoose from 'mongoose';
const mongoURI = 'mongodb://localhost:27017/GymManagement'; // replace with your MongoDB URI
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // exit process if db connection fails
  }
};

export default connectDB;