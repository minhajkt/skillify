import { Router } from 'express'
import { PaymentRepository } from './repositories/PaymentRepository'
import { PaymentService } from './services/PaymentService'
import { PaymentController } from './controllers/PaymentController'

const paymentRouter = Router()


const paymentRepository = new PaymentRepository()
const paymentService = new PaymentService(paymentRepository)
const paymentController = new PaymentController(paymentService)

paymentRouter.get('/payments/pending', paymentController.getPendingPayments.bind(paymentController))
paymentRouter.put('/payments/:paymentId', paymentController.completePayment.bind(paymentController))
paymentRouter.get('/payments/history', paymentController.getPaymentHistory.bind(paymentController))
paymentRouter.get('/payments/tutors/:tutorId', paymentController.tutorRecievable.bind(paymentController))


// paymentRouter.post('/payments/settle', paymentController.initiatePayment.bind(paymentController))

export default paymentRouter