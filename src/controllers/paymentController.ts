import Stripe from "stripe";
import { Response } from "express";
import { AuthenticatedRequest } from "../models/globalModels";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export const createPaymentIntent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create payment intent", error });
  }
};
