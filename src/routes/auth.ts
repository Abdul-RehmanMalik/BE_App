import express from 'express'
import { AuthController } from '../controllers/auth'
import {
  forgotPasswordValidation,
  loginValidation,
  resetPasswordValidation,
  signUpValidation,
  signUpVerificationValidation,
  updatePasswordValidation,
  verifypassValidation,
} from '../util/validation'
import {
  authenticateAccessToken,
  authenticateActivationToken,
  authenticatePasswordResetToken,
} from '../middleware/authenticatetoken'

const authRouter = express.Router()
const authController = new AuthController()
// Signup route
authRouter.post('/signup', async (req, res) => {
  const { error, value: body } = signUpValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await authController.signUp(body)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
// Login route
authRouter.post('/login', async (req, res) => {
  const { error, value: body } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await authController.login(body)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//verifypass
authRouter.post('/verifypassword', async (req, res) => {
  const { error, value: body } = verifypassValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await authController.verifyPassword(body)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//logout route
authRouter.get('/logout', authenticateAccessToken, async (req, res) => {
  try {
    const logoutResponse = await authController.logout(req)
    res.send(logoutResponse)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//activation route
authRouter.post('/activate', authenticateActivationToken, async (req, res) => {
  try {
    const { error, value: body } = signUpVerificationValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const response = await authController.activateUser(body)
    //res.redirect("");
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//reset password
authRouter.post(
  '/resetpassword',
  authenticatePasswordResetToken,
  async (req, res) => {
    const { error, value: body } = resetPasswordValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
      const response = await authController.resetPassword(body)
      //res.redirect("");
      res.send(response)
    } catch (err: any) {
      res.status(err.code).send(err.message)
    }
  }
)
//update password
authRouter.put(
  '/updatepassword',

  async (req, res) => {
    const { error, value: body } = updatePasswordValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
      console.log('in route')
      const response = await authController.updatePassword(body)
      res.send(response)
    } catch (err: any) {
      res.status(err.code).send(err.message)
    }
  }
)
//forgot password
authRouter.post('/forgotpassword', async (req, res) => {
  const { error, value: body } = forgotPasswordValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await authController.forgotPassword(body)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//resend password reset token
authRouter.post('/resendpasswordtoken', async (req, res) => {
  const { error, value: body } = forgotPasswordValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const response = await authController.resendPasswordToken(body)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
export default authRouter
