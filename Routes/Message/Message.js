import express from 'express';
import { sendMessage ,getMemberDropdown,getTrainerDropdown } from '../../controllers/Message/MessageController.js';
const router = express.Router();

router.post('/send', sendMessage);
router.get('/members', getMemberDropdown);
router.get('/trainers', getTrainerDropdown);

export default router;
