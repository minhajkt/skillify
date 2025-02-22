import express from 'express'
import WebhookController from './webhookController'

const webhookRouter = express.Router()

webhookRouter.post('/webhook', WebhookController.stripeWebhook)

export default webhookRouter;