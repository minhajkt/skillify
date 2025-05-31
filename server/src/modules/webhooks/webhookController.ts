import { Request, Response } from "express";
import Stripe from "stripe";
import Enrollment from "../enrollment/models/enrollmentModel";
import Course from "../courses/models/courseModel";
import Payment from "../payments/models/paymentModel";
import Lecture from '../lectures/models/lectureModel'
import Progress from '../courseProgress/models/progressModel'
import { HttpStatus } from "../../constants/httpStatus";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export default class WebhookController {
  static stripeWebhook = async (req: Request, res: Response): Promise<void> => {
console.log('this route is hitting from webhook controler')
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send(`Webhook Error: ${(error as Error).message}`);
      return;
    }

    let responseSent = false;
console.log("Received event type:", event.type, "at", new Date().toLocaleTimeString());
    try {
      switch (event.type) {
        case "checkout.session.completed":
try {
            console.log(
              "Received checkout.session.completed event",
              new Date().toLocaleTimeString()
            );
            const session = event.data.object as Stripe.Checkout.Session;
            
  
            const userId = session.metadata?.userId;
            
            const courseId = session.metadata?.courseId;
            
            const paymentMethod = session.payment_method_types[0];
            
            const amount = session.amount_total ? session.amount_total / 100 : 0;
            
  
	const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
          console.log("Duplicate event detected, skipping...");
          break;
        }

            await Enrollment.create({
              userId,
              courseId,
              paymentMethod,
              paymentStatus: "Success",
              amount,
            });
  
            console.log('enrollment creation executed at',new Date().toLocaleTimeString());
  // this is for progress tracking, creating progress model when a enrollment is created          
            const totalLectures = await Lecture.countDocuments({courseId})
  
            if(totalLectures === 0) {
              return;
            }
  
            await Progress.create({
              userId,
              courseId,
              totalLectures
            })      
            
            console.log(
              "progress creation executed at",
              new Date().toLocaleTimeString()
            );
            
  
            const course = await Course.findById(courseId)
              .select("price createdBy")
              .populate({ path: "createdBy", select: "name" });
  
            if (!course) {
              return; 
            }
  
            const tutorId = course.createdBy._id;
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
            } else {
              await Payment.create({
                tutorId,
                courseId,
                amount: amountPayable,
                status: "Pending",
                newEnrollments: 1,
              });
            }
  
            console.log(
              "payment to be done creation executed at",
              new Date().toLocaleTimeString()
            );
          } catch (error) {
            console.error(
              "Error in checkout.session.completed:",
              (error as Error).message
            );
          }

          responseSent = true; 
          break;

        case "payment_intent.payment_failed":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;

          const failedUserId = paymentIntent.metadata?.userId;
          const failedAmount = paymentIntent.amount_received
            ? paymentIntent.amount_received / 100
            : 0;


          responseSent = true; 
console.log(
            "faliing paymnet case 2",
            new Date().toLocaleTimeString()
          );
          break;

       

        default:
console.log(
            "default  case ,default",
            new Date().toLocaleTimeString()
          );
          // console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
console.log('error in catch webhook',(error as Error).message,
            new Date().toLocaleTimeString())
      // console.log("Error in processing webhook", (error as Error).message);
    }

    
console.log("Sending 200 OK response to Stripe");
      res.status(HttpStatus.OK).send("Event received");
    
  };
}
