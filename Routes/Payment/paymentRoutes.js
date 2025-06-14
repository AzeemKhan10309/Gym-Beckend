import express from "express";
const router = express.Router();
import { processPayment ,getAllPayments,getPaymentById,updatePayment ,deletePayment,feereminder } from "../../controllers/Payments/paymentController.js";

import { verifyToken } from "../../middleware/authMiddleware.js";

// Route to process a new payment
router.post("/", verifyToken, processPayment);  
// Route to get all payments
router.get("/", verifyToken, getAllPayments);
 router.get("/notifications" , verifyToken , feereminder)

// Route to get a payment by ID
router.get("/:id", verifyToken, getPaymentById);
// Route to update a payment by ID
router.put("/:id", verifyToken, updatePayment);

// Route to delete a payment by ID
router.delete("/:id", verifyToken, deletePayment);

export default router;