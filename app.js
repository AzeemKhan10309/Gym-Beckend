import express from 'express';
import connectDB from './db/db.js'; 
import adminRoutes from './Routes/Admin/adminRoutes.js';
import trainerRoutes from "./Routes/trainerRoutes.js"
import memberRoutes from "./Routes/Member/memberRoutes.js";
import paymentRoutes from "./Routes/Payment/paymentRoutes.js";
import attendenceRoutes from "./Routes/Attendence/attendenceRoutes.js";
import workoutmeals from "./Routes/Workout&Meal/workout&mealRoutes.js";
import memberShip from "./Routes/Membership/membershipRoutes.js";
import messageRoutes from "./Routes/Message/Message.js";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5173', 'http://192.168.43.237:8081'], 
  credentials: true,
}));
app.use('/api/members', memberRoutes);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static('uploads'));

connectDB();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api', adminRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/memberships', memberShip);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendenceRoutes);
app.use('/api/workoutmeals', workoutmeals);
app.use('/api/messages', messageRoutes);


//app.listen(PORT, '0.0.0.0', () => {
  //console.log(`Server is running on http://192.168.43.237:${PORT}`);
//});
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});