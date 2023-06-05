import express from 'express'
import { getUserValidation } from '../util/validation'
import { UserController } from '../controllers/users'
import { upload } from '../middleware/multermiddleware'

const userRouter = express.Router()
const userController = new UserController()
// getuser route
userRouter.get('/:username', async (req, res) => {
  const { error, value: params } = getUserValidation(req.params)
  if (error) return res.status(400).send(error.details[0].message)
  const { username } = params
  try {
    console.log('in route')
    const response = await userController.getUser(req, username)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
//search user
userRouter.post('/search', async (req, res) => {
  try {
    console.log('in route')
    console.log('body:', req.body)
    const response = await userController.searchUser(req.body)
    res.send(response)
  } catch (err: any) {
    console.log('In Catch')
    res.status(err.code).send(err.message)
  }
})
userRouter.put(
  '/updateprofilepic',
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      console.log('in try')
      console.log('Req Body Route:', req.body.image)
      const response = await userController.updateProfilePic(req, req.body)
      res.send(response)
    } catch (err: any) {
      console.log('in catch')
      res.status(err.code).send(err.message)
    }
  }
)

export default userRouter
