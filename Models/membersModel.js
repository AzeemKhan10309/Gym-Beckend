import mongoose from 'mongoose';
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  date_of_birth: { type: Date },
  membership_start_date: { type: Date },
  membership_end_date: { type: Date },
  membership_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: false },
  password: { type: String, required: true },
  isFeePaid: { type: Boolean, default: false },

  special_code: {
  type: String,
  unique: true,
  required: false
}
});

export default mongoose.model('Member', MemberSchema);