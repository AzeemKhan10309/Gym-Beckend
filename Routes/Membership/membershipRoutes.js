import express from "express";
const router = express.Router();
import {} from "../../controllers/Membership/membershipController.js";
import { registerMembership, getAllMemberships, getMembershipById, updateMembership ,deleteMembership} from "../../controllers/Membership/membershipController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";

// Route to register a new membership
router.post("/", verifyToken, registerMembership);
// Route to get all memberships
router.get("/", verifyToken, getAllMemberships);
// Route to get a membership by ID
router.get("/:id", verifyToken, getMembershipById);
// Route to update a membership by ID
router.put("/:id", verifyToken, updateMembership);
// Route to delete a membership by ID
router.delete("/:id", verifyToken,deleteMembership );
export default router;