import mongoose from 'mongoose';
const MembershipPlanSchema = new mongoose.Schema({
  plan_name: { type: String, required: true },
  duration_in_days: { type: Number, required: true },
  price: { type: Number, required: true },
  description:{ type: String },
});

export default mongoose.model('MembershipPlan', MembershipPlanSchema);