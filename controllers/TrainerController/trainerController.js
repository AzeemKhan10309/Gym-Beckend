import Trainer from "../../Models/trainerModel.js";
import Member from "../../Models/membersModel.js"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
export const registerTrainer = async (req, res) => {
    const { name, email, phone, fee, expertise, password, working_hours } = req.body;

    try {
        const existingTrainer = await Trainer.findOne({ email });
        if (existingTrainer) {
            return res.status(400).json({ message: "Trainer already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTrainer = new Trainer({
            name,
            email,
            phone,
            fee,
            expertise,
            password: hashedPassword,
            working_hours
        });
        await newTrainer.save();
        res.status(201).json({
            message: "Trainer registered successfully",
            trainer: {
                id: newTrainer._id,
                name: newTrainer.name,
                email: newTrainer.email,
                phone: newTrainer.phone,
                fee:newTrainer.fee,
                expertise: newTrainer.expertise,
                working_hours: newTrainer.working_hours
            }
        });
    }
    catch (error) {
        console.error("Error registering trainer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const loginTrainer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const trainer = await Trainer.findOne({ email });
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, trainer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({
            message: "Trainer logged in successfully",
            trainer: {
                id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                phone: trainer.phone,
                expertise: trainer.expertise,
                working_hours: trainer.working_hours
            }
        });
    } catch (error) {
        console.error("Error logging in trainer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.status(200).json({
            message: "Trainers retrieved successfully",
            trainers
        });
    } catch (error) {
        console.error("Error retrieving trainers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getTrainerById = async (req, res) => {
    const { id } = req.params;

    try {
        const trainer = await Trainer.findById(id);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.status(200).json({
            message: "Trainer retrieved successfully",
            trainer
        });
    } catch (error) {
        console.error("Error retrieving trainer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateTrainer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone,fee, expertise, working_hours } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid trainer ID" });
    }
    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            fee,
            expertise,
            working_hours
        }, { new: true });

        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.status(200).json({
            message: "Trainer updated successfully",
            trainer: updatedTrainer
        });
    } catch (error) {
        console.error("Error updating trainer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteTrainer = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid trainer ID" });
    }
    try {
        const deletedTrainer = await Trainer.findByIdAndDelete(id);
        if (!deletedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.status(200).json({
            message: "Trainer deleted successfully",
            trainer: deletedTrainer
        });
    } catch (error) {
        console.error("Error deleting trainer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getMembersByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
        
     if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ message: "Invalid trainer ID" });
    }
    const members = await Member.find({ trainer_id: trainerId}).populate('membership_plan_id').populate('assignedWorkoutPlan')
  .populate('assignedDietPlan'); 
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
};