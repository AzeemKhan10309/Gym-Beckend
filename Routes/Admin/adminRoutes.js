import express from "express";
import { registerAdmin, loginAdmin } from "../../controllers/Admin/adminController.js";
const router = express.Router();

// Route to register a new admin
router.post("/register", registerAdmin);
// Route to log in an existing admin
router.post("/login", loginAdmin);

// Export the router to be used in the main app
export default router;