import DietPlan from "../../Models/dietPlanModel.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import WorkoutPlan from "../../Models/workoutModel.js";




export const createDietPlanforspecific = async (req, res) => {
    const { memberId, dietType, meals } = req.body;

    try {
        const newDietPlan = new DietPlan({
            memberId,
            dietType,
            meals
        });

        await newDietPlan.save();
        res.status(201).json({
            message: "Diet plan created successfully",
            dietPlan: {
                id: newDietPlan._id,
                memberId: newDietPlan.memberId,
                dietType: newDietPlan.dietType,
                meals: newDietPlan.meals
            }
        });
    } catch (error) {
        console.error("Error creating diet plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}       
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
    const { dietType, meals } = req.body;

    try {
        const updatedDietPlan = await DietPlan.findByIdAndUpdate(
            id,
            { dietType, meals },
            { new: true }
        );
        if (!updatedDietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }
        res.status(200).json({
            message: "Diet plan updated successfully",
            dietPlan: updatedDietPlan
        });
    } catch (error) {
        console.error("Error updating diet plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}       
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
export const createWorkoutPlan = async (req, res) => {
    const { memberId, workoutType, exercises } = req.body;

    try {
        const newWorkoutPlan = new WorkoutPlan({
            memberId,
            workoutType,
            exercises
        });

        await newWorkoutPlan.save();
        res.status(201).json({
            message: "Workout plan created successfully",
            workoutPlan: {
                id: newWorkoutPlan._id,
                memberId: newWorkoutPlan.memberId,
                workoutType: newWorkoutPlan.workoutType,
                exercises: newWorkoutPlan.exercises
            }
        });
    } catch (error) {
        console.error("Error creating workout plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllWorkoutPlans = async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find();
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
    const { id } = req.params;
    const { workoutType, exercises } = req.body;

    try {
        const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(
            id,
            { workoutType, exercises },
            { new: true }
        );
        if (!updatedWorkoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }
        res.status(200).json({
            message: "Workout plan updated successfully",
            workoutPlan: updatedWorkoutPlan
        });
    } catch (error) {
        console.error("Error updating workout plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}   
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