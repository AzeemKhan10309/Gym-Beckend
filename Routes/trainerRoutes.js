import express from "express";
const router = express.Router();
import { registerTrainer, loginTrainer,getAllTrainers,getTrainerById,updateTrainer,deleteTrainer ,getMembersByTrainer } from "../controllers/TrainerController/trainerController.js";
import {verifyToken} from "../middleware/authMiddleware.js"



router.post("/register", registerTrainer);
router.post("/login", loginTrainer);
router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);
router.get("/trainerMember/:trainerId" , verifyToken , getMembersByTrainer)

export default router;