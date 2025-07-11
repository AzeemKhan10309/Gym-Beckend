import express from "express";
const router = express.Router();
import { processPayment ,getPaymentById ,deletePayment,feereminder ,getMemberPaymentSummary,getRevenueSummary } from "../../controllers/Payments/paymentController.js";

import { verifyToken } from "../../middleware/authMiddleware.js";

router.post("/", verifyToken, processPayment); 
router.get("/revenue", verifyToken, getRevenueSummary);

 router.get("/notifications" , verifyToken , feereminder)

router.get("/:id", verifyToken, getPaymentById);

// Route to delete a payment by ID
router.delete("/:id", verifyToken, deletePayment);

router.get("/summary/:id", verifyToken, getMemberPaymentSummary);
export default router;