// console.log('server running...')

import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
// import cors from 'cors' //`see frontend 'Dashboard.js'(1)`

import connectDB from './DB/connectDB.js'

import authRouters from './routers/authRouters.js'
import jobRouters from './routers/jobRouters.js'

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

// app.use(cors()) //`see frontend 'Dashboard.js'(1)`
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Welcome!' )
// })

// app.get('/', (req, res) => {
//   res.json({ msg: 'Welcome!' })
// }) //`see frontend 'Dashboard.js'(1)`

app.get('/api', (req, res) => {
  res.json({ msg: 'API' })
}) //`see frontend 'Dashboard.js'(2)`
app.use('/api/auth', authRouters)
app.use('/api/job', jobRouters)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()
