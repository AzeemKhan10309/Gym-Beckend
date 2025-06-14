// app.js
import express from 'express';
import connectDB from './db/db.js'; 
import adminRoutes from './Routes/Admin/adminRoutes.js';
import trainerRoutes from "./Routes/trainerRoutes.js"
import memberRoutes from "./Routes/Member/memberRoutes.js";
import paymentRoutes from "./Routes/Payment/paymentRoutes.js";
import attendenceRoutes from "./Routes/Attendence/attendenceRoutes.js";
import workoutmeals from "./Routes/Workout&Meal/workout&mealRoutes.js";
import memberShip from "./Routes/Membership/membershipRoutes.js";
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
       

dotenv.config(); 
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
connectDB();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
// Import admin routes
app.use('/api', adminRoutes);
// Import trainer routes
app.use('/api/trainers', trainerRoutes);
// Import member routes
app.use('/api/members', memberRoutes);
// Import membership routes
app.use('/api/memberships', memberShip);
// Import payment routes
app.use('/api/payments', paymentRoutes);
// Import attendance routes
app.use('/api/attendance', attendenceRoutes);
// Import workout and meal routes
app.use('/api/workoutmeals', workoutmeals);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
