import express from 'express';
const router = express.Router();
import { markAttendance, getAllAttendance,getAttendanceById , updateAttendance, deleteAttendance } from "../../controllers/Attendence/attendenceController.js";
import { verifyToken } from '../../middleware/authMiddleware.js';


router.post('/mark/:memberId', verifyToken, markAttendance);
router.get('/', verifyToken, getAllAttendance);
router.get('/:id', verifyToken, getAttendanceById);
router.put('/:id', verifyToken, updateAttendance);
router.delete('/:id', verifyToken, deleteAttendance);
export default router;