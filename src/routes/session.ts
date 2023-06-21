import express from 'express'
import { SessionController } from '../controllers/session'
import { authenticateAccessToken } from '../middleware/authenticatetoken'

const sessionRouter = express.Router()

sessionRouter.get('/',authenticateAccessToken, async (req, res) => {
  const controller = new SessionController()
  try {
    const response = await controller.session(req)
    console.log("Session Response:",response)
    res.send(response)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
})

export default sessionRouter
