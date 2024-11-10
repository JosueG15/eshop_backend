import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { createPaymentIntent } from "../controllers/paymentController";

const router = Router();

router.post("/payments/create-payment-intent", protect, createPaymentIntent);

export default router;
