import { Request, Response } from "express";
import Stripe from "stripe";
import Enrollment from "../enrollment/models/enrollmentModel";
import Course from "../courses/models/courseModel";
import Payment from "../payments/models/paymentModel";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export default class WebhookController {
  static stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.log(
        "Webhook signature verification failed:",
        (error as Error).message
      );
      res.status(400).send(`Webhook Error: ${(error as Error).message}`);
      return;
    }

    let responseSent = false;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;

          const userId = session.metadata?.userId;
          const courseId = session.metadata?.courseId;
          const paymentMethod = session.payment_method_types[0];
          const amount = session.amount_total ? session.amount_total / 100 : 0;

          await Enrollment.create({
            userId,
            courseId,
            paymentMethod,
            paymentStatus: "Success",
            amount,
          });
          console.log("Enrollment created for user", userId);

          const course = await Course.findById(courseId)
            .select("price createdBy")
            .populate({ path: "createdBy", select: "name" });

          if (!course) {
            console.log("Course not found for courseId", courseId);
            return; 
          }

          const tutorId = course.createdBy._id;
          const tutorName = course.createdBy.name;
          const coursePrice = course.price;

          const existingPayment = await Payment.findOne({
            courseId,
            tutorId,
            status: "Pending",
          });

          const amountPayable = coursePrice * 0.8
          if (existingPayment) {
            existingPayment.amount += amountPayable;
            existingPayment.newEnrollments =
              (existingPayment.newEnrollments || 0) + 1;
            await existingPayment.save();
            console.log("Updated payment record for tutor", tutorId);
          } else {
            await Payment.create({
              tutorId,
              courseId,
              amount: amountPayable,
              status: "Pending",
              // paymentDate: 'N/A',
              newEnrollments: 1,
            });
            console.log("Created new payment record for tutor", tutorId);
          }

          responseSent = true; 
          break;

        case "payment_intent.payment_failed":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          const failedUserId = paymentIntent.metadata?.userId;
          const failedAmount = paymentIntent.amount_received
            ? paymentIntent.amount_received / 100
            : 0;
          console.log(
            `Payment failed for user ${failedUserId}, amount: ${failedAmount}`
          );

          responseSent = true; 
          break;

        case "charge.succeeded":
        case "payment_intent.succeeded":
        case "payment_intent.created":
          console.log(`Unhandled event type ${event.type}`);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.log("Error in processing webhook", (error as Error).message);
    }

    if (!responseSent) {
      res.status(200).send("Event received");
    }
  };
}

/////////////////////////////////////////////////////////

// import { Request, Response } from "express";
// import Stripe from "stripe";
// import Enrollment from "../enrollment/models/enrollmentModel";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error(
//     "STRIPE_SECRET_KEY is not defined in the environment variables."
//   );
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-12-18.acacia",
// });

// export default class WebhookController {
//   static stripeWebhook = async (req: Request, res: Response): Promise<void> => {
//     const sig = req.headers["stripe-signature"] as string;

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );
//     } catch (error) {
//       console.log(
//         "Webhook signature verification failed:",
//         (error as Error).message
//       );
//       res.status(400).send(`Webhook Error: ${(error as Error).message}`);
//       return;
//     }
//     switch (event.type) {
//       case "checkout.session.completed":
//         const session = event.data.object as Stripe.Checkout.Session;

//         try {
//           const userId = session.metadata?.userId;
//           const courseId = session.metadata?.courseId;
//           const paymentMethod = session.payment_method_types[0];
//           const amount = session.amount_total ? session.amount_total / 100 : 0;

//           await Enrollment.create({
//             userId,
//             courseId,
//             paymentMethod,
//             paymentStatus: "Success",
//             amount,
//           });
//           console.log("Enrollment created for user", userId);
//         } catch (error) {
//           console.log("Failed to create enrollment", (error as Error).message);
//           res.status(500).send("Internal Server Error");
//           return;
//         }
//         break;

//       case "payment_intent.payment_failed":
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;

//         try {
//           const userId = paymentIntent.metadata?.userId;
//           const amount = paymentIntent.amount_received
//             ? paymentIntent.amount_received / 100
//             : 0;
//           console.log(`Payment failed for user ${userId}, amount: ${amount}`);
//         } catch (error) {
//           console.log(
//             "Failed to handle failed payment",
//             (error as Error).message
//           );
//           res.status(500).send("Internal Server Error");
//           return;
//         }
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//     res.status(200).send("Event recieved");
//   };
// }
