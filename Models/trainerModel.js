import mongoose from 'mongoose';
const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  fee: { type: Number, required: true },
  expertise: { type: String },
  password: { type: String, required: true },
    experience: String,

  working_hours: { type: String }
});

export default mongoose.model('Trainer', TrainerSchema);