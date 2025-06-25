import mongoose from 'mongoose';
const WorkoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  assignedWorkoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },

  days: [
    {
      day: { type: String, required: true },
      warmup: { type: String },
      optional: { type: String },
      exercises: [
        {
          name: { type: String, required: true },
          sets: { type: Number, required: true },
          reps: { type: Number, required: true },
          notes: { type: String }
        }
      ]
    }
  ]
});


export default mongoose.model('WorkoutPlan', WorkoutPlanSchema);