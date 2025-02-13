import { Router } from 'express'
import { PaymentRepository } from './repositories/PaymentRepository'
import { PaymentService } from './services/PaymentService'
import { PaymentController } from './controllers/PaymentController'
import { authenticateJWT } from '../../middlewares/authenticateJWT'

const paymentRouter = Router()


const paymentRepository = new PaymentRepository()
const paymentService = new PaymentService(paymentRepository)
const paymentController = new PaymentController(paymentService)

paymentRouter.get('/payments/pending',authenticateJWT, paymentController.getPendingPayments.bind(paymentController))
paymentRouter.put('/payments/:paymentId', authenticateJWT,paymentController.completePayment.bind(paymentController))
paymentRouter.get('/payments/history', authenticateJWT, paymentController.getPaymentHistory.bind(paymentController))
paymentRouter.get('/payments/tutors/:tutorId', authenticateJWT,paymentController.tutorRecievable.bind(paymentController))


// paymentRouter.post('/payments/settle', paymentController.initiatePayment.bind(paymentController))

export default paymentRouter