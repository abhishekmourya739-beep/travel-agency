import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create_order/:bookingId", auth, createPaymentOrder);
router.post("/verify", auth, verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
