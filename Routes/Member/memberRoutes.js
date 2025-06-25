import express from "express";
const router = express.Router();
import { registerMember, loginMember, getAllMembers, getMemberById, updateMember, deleteMember , autoSearch, getMemberPaymentDetails ,getMemberDetails} from "../../controllers/Member/memberController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";   
// Define routes for member operations
router.post("/register", registerMember);
router.post("/login", loginMember); 
router.get("/", getAllMembers);
router.get("/details/:id", verifyToken, getMemberDetails);
router.get('/search/:query', getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember); 
router.get("/search", autoSearch);
router.get("/payment-details/:id",verifyToken ,getMemberPaymentDetails)   
export default router;