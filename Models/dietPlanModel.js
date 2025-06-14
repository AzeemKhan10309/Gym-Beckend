import mongoose from 'mongoose';
const DietPlanSchema = new mongoose.Schema({
  member_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  description: { type: String },
  created_date: { type: Date, default: Date.now }
});

 export default mongoose.model('DietPlan', DietPlanSchema);