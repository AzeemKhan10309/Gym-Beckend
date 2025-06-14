import express from "express";
const router = express.Router();
import { registerTrainer, loginTrainer,getAllTrainers,getTrainerById,updateTrainer,deleteTrainer } from "../controllers/TrainerController/trainerController.js";




router.post("/register", registerTrainer);
router.post("/login", loginTrainer);
router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

export default router;