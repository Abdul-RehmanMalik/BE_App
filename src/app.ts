import express from 'express'
import dotenv from 'dotenv'
import { connectToMongoDB } from './util/dbConnection'
import router from './routes/index'
import path from 'path'
import cors from 'cors'
import { ReturnCode, verifyEnvVariables } from './util/verifyEnvVariables'
import { createAdminUser } from './util/createAdmin'
const app = express()
dotenv.config()

if (verifyEnvVariables()) process.exit(ReturnCode.InvalidEnv)

// port from env file
const port = process.env.PORT

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, '../public')))

// router
app.use('/', router)

const startServer = async () => {
  try {
    await connectToMongoDB()
    app.listen(port, () => {
      console.log('Server is running on port', port)
    })
  } catch (error) {
    console.error('Failed to Connect to MongoDb', error)
  }
}
startServer()
createAdminUser()
