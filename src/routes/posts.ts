import express from 'express'
import { PostController } from '../controllers/posts'
import { upload } from '../middleware/multermiddleware'
import {
  createpostValidation,
  deleteeditcommentvalidation,
  getcommentvalidation,
  getuserpostvalidation,
  likeunlikepostvalidation,
} from '../util/validation'

const postRouter = express.Router()
const postController = new PostController()

postRouter.post('/createpost', upload.array('images'), async (req, res) => {
  const { error, value: body } = createpostValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    console.log('in try')
    console.log('Req Files Route:', req)
    console.log('Req Body Route: ', req.body)
    const response = await postController.createPost(req, req.body)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.put('/like', async (req, res) => {
  try {
    const { error, value: body } = likeunlikepostvalidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    console.log('in like route try')
    console.log('req.body', body)
    const response = await postController.likePost(body)
    res.send(response)
  } catch (err: any) {
    console.log('in like route catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.get('/getall', async (req, res) => {
  try {
    console.log('in get all route try')
    const response = await postController.getAllPosts(req)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.post('/addComment', async (req, res) => {
  try {
    console.log('in try')
    console.log('Req Body Route: ', req.body)
    const response = await postController.addComment(req.body)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.get('/getcomments', async (req, res) => {
  try {
    const {
      error,
      value: { postId },
    } = getcommentvalidation(req.query)
    if (error) return res.status(400).send(error.details[0].message)
    console.log('in try')
    // const postId = Number(req.query.postId)
    const response = await postController.getComments(postId)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.delete('/deletecomment/:cid', async (req, res) => {
  try {
    const {
      error,
      value: { cid },
    } = deleteeditcommentvalidation(req.params)
    if (error) return res.status(400).send(error.details[0].message)
    console.log('in try')
    // const cid = Number(req.params.cid)
    const response = await postController.deleteComment(cid)
    res.send(response)
  } catch (err: any) {
    console.log('in catch')
    res.status(err.code).send(err.message)
  }
})
postRouter.put('/editcomment/:cid', async (req, res) => {
  try {
    const {
      error,
      value: { cid },
    } = deleteeditcommentvalidation(req.params)
    if (error) return res.status(400).send(error.details[0].message)
    console.log('in try edit comment')
    // const cid = Number(req.params.cid)
    const response = await postController.editComment(cid, req.body)
    res.send(response)
  } catch (err: any) {
    console.log('in catch edit comment')
    res.status(err.code).send(err.message)
  }
})
postRouter.get('/getuserposts', async (req, res) => {
  try {
    const {
      error,
      value: { userId },
    } = getuserpostvalidation(req.query)
    if (error) return res.status(400).send(error.details[0].message)
    const response = await postController.findPostsByUserId(userId)
    res.send(response)
  } catch (err: any) {
    res.status(err.code).send(err.message)
  }
})
export default postRouter
