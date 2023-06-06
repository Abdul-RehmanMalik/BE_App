import express from 'express'
import { PostController } from '../controllers/posts'
import { upload } from '../middleware/multermiddleware'
const postRouter = express.Router()
const postController = new PostController()

postRouter.post('/createpost', upload.array('images'), async (req, res) => {
  // const { error, value: body } = postValidation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  try {
    console.log('in try')
    console.log('Req Body Route:', req.files) // Use req.files to access the array of uploaded files
    const response = await postController.createPost(req, req.body) // Pass req.files as the first argument
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.put('/like', async (req, res) => {
  try {
    console.log('in try')
    const response = await postController.likePost(req.body)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.put('/unlike', async (req, res) => {
  try {
    console.log('in try')
    const response = await postController.unlikePost(req.body)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.get('/getall', async (req, res) => {
  try {
    console.log('in try')
    const response = await postController.getAllPosts(req)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
export default postRouter