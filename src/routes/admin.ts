import express from 'express'
import { AdminController } from '../controllers/admin'
import { suspendUserValidation } from '../util/validation'

const adminRouter = express.Router()
const adminController = new AdminController()
// Suspend user
adminRouter.put('/suspenduser', async (req, res) => {
  try {
    const { error, value: body } = suspendUserValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    console.log('in route')
    console.log('body:', req.body)
    const response = await adminController.suspendUser(body)
    res.send(response)
  } catch (err: any) {
    console.log('In Catch')
    res.status(err.code).send(err.message)
  }
})

