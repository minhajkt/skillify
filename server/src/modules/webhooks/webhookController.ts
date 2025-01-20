import { Request, Response } from "express";
import Stripe from "stripe";
import Enrollment from '../enrollment/models/enrollmentModel'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});



export default class WebhookController {
    static stripeWebhook = async(req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'] as string;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
              req.body,
              sig,
              process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (error) {
            console.log("Webhook signature verification failed:", (error as Error).message);
            return res.status(400).send(`Webhook Error: ${(error as Error).message}`)
        }
        switch (event.type) {
          case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;

            try {
              const userId = session.metadata?.userId;
              const courseId = session.metadata?.courseId;
              const paymentMethod = session.payment_method_types[0];
              const amount = session.amount_total
                ? session.amount_total / 100
                : 0;

              await Enrollment.create({
                userId,
                courseId,
                paymentMethod,
                paymentStatus: "Success",
                amount,
              });
              console.log("Enrollment created for user", userId);
            } catch (error) {
              console.log(
                "Failed to create enrollment",
                (error as Error).message
              );
              return res.status(500).send("Internal Server Error");
            }
            break;

          case "payment_intent.payment_failed":
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            try {
              const userId = paymentIntent.metadata?.userId; 
              const amount = paymentIntent.amount_received
                ? paymentIntent.amount_received / 100
                : 0;
              console.log(`Payment failed for user ${userId}, amount: ${amount}`
              );
            } catch (error) {
              console.log(
                "Failed to handle failed payment",
                (error as Error).message
              );
              return res.status(500).send("Internal Server Error");
            }
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).send('Event recieved')
    }
}