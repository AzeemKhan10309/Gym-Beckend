import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  day: { type: String, required: true },
  breakfast: String,
  midMorningSnack: String,
  lunch: String,
  eveningSnack: String,
  dinner: String,
  postDinnerSnack: String,
});

const DietPlanSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  assignedDietPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },

  diet: [mealSchema], 
});

export default mongoose.model('DietPlan', DietPlanSchema);
