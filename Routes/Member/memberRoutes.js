import express from "express";
const router = express.Router();
import { registerMember, loginMember, getAllMembers, getMemberById, updateMember, deleteMember , autoSearch, getMemberPaymentDetails ,getMemberDetails ,memberDashboard} from "../../controllers/Member/memberController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";   
import { upload } from '../../middleware/upload.js';

// Define routes for member operations
router.post("/register", upload.single('profileImage'),registerMember);
    
router.post("/login", loginMember); 
router.get("/", getAllMembers);
router.get("/details/:id", verifyToken, getMemberDetails);
router.get('/search/:query', getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember); 
router.get("/search", autoSearch);
router.get("/payment-details/:id",verifyToken ,getMemberPaymentDetails) ;
router.get("/dashboard", verifyToken, memberDashboard);  
export default router;