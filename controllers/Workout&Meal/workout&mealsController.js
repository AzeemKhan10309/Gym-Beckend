import DietPlan from "../../Models/dietPlanModel.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import WorkoutPlan from "../../Models/workoutModel.js";
import Member from '../../Models/membersModel.js';




export const createDietPlanforspecific = async (req, res) => {
  try {
    // Destructure correctly from req.body
    const { trainerId, planName, diet } = req.body;

    // Check required fields
    if (!trainerId || !planName || !diet) {
      return res.status(400).json({ message: "trainerId, planName, and diet are required" });
    }

    // Create new diet plan
    const newDietPlan = new DietPlan({
      trainerId,
      planName,
      diet
    });

    // Save to database
    await newDietPlan.save();

    // Return success
    res.status(201).json({
      message: "Diet plan created successfully",
      dietPlan: newDietPlan
    });
  } catch (error) {
    console.error("Error creating diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};     
export const getAllDietPlans = async (req, res) => {
    try {
        const dietPlans = await DietPlan.find();
        res.status(200).json(dietPlans);
    } catch (error) {
        console.error("Error fetching diet plans:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getDietPlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const dietPlan = await DietPlan.findById(id);
        if (!dietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }
        res.status(200).json(dietPlan);
    } catch (error) {
        console.error("Error fetching diet plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateDietPlan = async (req, res) => {
  const { id } = req.params;
  const { planName, trainerId, diet } = req.body;

  try {
    const updatedDietPlan = await DietPlan.findByIdAndUpdate(
      id,
      {
        planName,
        trainerId,
        diet,
      },
      { new: true }
    );

    if (!updatedDietPlan) {
      return res.status(404).json({ message: "Diet plan not found" });
    }

    res.status(200).json({
      message: "Diet plan updated successfully",
      dietPlan: updatedDietPlan,
    });
  } catch (error) {
    console.error("Error updating diet plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
       
export const deleteDietPlan = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDietPlan = await DietPlan.findByIdAndDelete(id);
        if (!deletedDietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }
        res.status(200).json({
            message: "Diet plan deleted successfully",
            dietPlan: deletedDietPlan
        });
    } catch (error) {
        console.error("Error deleting diet plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// controllers/workoutController.js


export const createWorkoutPlan = async (req, res) => {  try {
    const { title, goals, days, isPublic } = req.body;
    const trainerId = req.user.id; // assuming you use auth middleware that sets req.user

    if (!title || !days || !Array.isArray(days)) {
      return res.status(400).json({ message: 'Title and valid days are required' });
    }

    // Basic validation for exercises inside days
    for (const day of days) {
      if (!day.day || !Array.isArray(day.exercises)) {
        return res.status(400).json({ message: 'Each day must have a name and exercises array' });
      }

      for (const exercise of day.exercises) {
        if (!exercise.name || !exercise.sets || !exercise.reps) {
          return res.status(400).json({ message: 'Each exercise must have name, sets, and reps' });
        }
      }
    }

    const newPlan = new WorkoutPlan({
      title,
      goals,
      isPublic,
      created_by: trainerId,
      days
    });

    await newPlan.save();

    return res.status(201).json({
      message: 'Workout plan created successfully',
      workoutPlan: newPlan,
    });

  } catch (error) {
    console.error('Error creating workout plan:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const getAllWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find({ created_by: req.user.id });;
        res.status(200).json(workoutPlans);
    } catch (error) {
        console.error("Error fetching workout plans:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getWorkoutPlanById = async (req, res) => {
    const { id } = req.params;

    try {
        const workoutPlan = await WorkoutPlan.findById(id);
        if (!workoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }
        res.status(200).json(workoutPlan);
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // Optional: if you are using auth-based user
    if (plan.user && plan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this plan' });
    }

    plan.title = req.body.title || plan.title;
    plan.days = req.body.days || plan.days;

    await plan.save();
    res.status(200).json({ message: 'Workout plan updated', plan });
  } catch (error) {
    console.error('Error updating workout plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteWorkoutPlan = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWorkoutPlan = await WorkoutPlan.findByIdAndDelete(id);
        if (!deletedWorkoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }
        res.status(200).json({
            message: "Workout plan deleted successfully",
            workoutPlan: deletedWorkoutPlan
        });
    } catch (error) {
        console.error("Error deleting workout plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const assignPlansToMember = async (req, res) => {
const { id } = req.params;
  const { workoutPlanId, dietPlanId } = req.body;

  const updated = await Member.findByIdAndUpdate(
    id,
    {
      ...(workoutPlanId && { assignedWorkoutPlan: workoutPlanId }),
      ...(dietPlanId && { assignedDietPlan: dietPlanId }),
    },
    { new: true }
  );

  res.status(200).json({ message: "Plans assigned", member: updated });
};
