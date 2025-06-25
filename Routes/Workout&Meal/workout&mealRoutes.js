import express from 'express';
const router = express.Router();
import { createDietPlanforspecific, getAllDietPlans,getDietPlanById,updateDietPlan,deleteDietPlan,createWorkoutPlan,getAllWorkoutPlans,getWorkoutPlanById,updateWorkoutPlan,deleteWorkoutPlan,assignPlansToMember} from '../../controllers/Workout&Meal/workout&mealsController.js';

import { verifyToken } from '../../middleware/authMiddleware.js';

// Workout routes
router.post('/workout', verifyToken, createWorkoutPlan);
router.get('/workout', verifyToken, getAllWorkoutPlans);
router.get('/workout/:id', verifyToken, getWorkoutPlanById);
router.put('/workout/:id', verifyToken, updateWorkoutPlan);
router.delete('/workout/:id', verifyToken, deleteWorkoutPlan);

// Diet routes  
router.post('/diet', verifyToken, createDietPlanforspecific);
router.get('/diet', verifyToken, getAllDietPlans);
router.get('/diet/:id', verifyToken, getDietPlanById);
router.put('/diet/:id', verifyToken, updateDietPlan);
router.delete('/diet/:id', verifyToken, deleteDietPlan);
router.put('/:id/assignPlans', verifyToken, assignPlansToMember);

export default router;