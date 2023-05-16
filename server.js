// console.log('server running...')

import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
// import cors from 'cors' //`see frontend 'Dashboard.js'(1)`
import morgan from 'morgan' //`HTTP request logger middleware for node.js`

import connectDB from './DB/connectDB.js'

import authRouters from './routers/authRouters.js'
import jobRouters from './routers/jobRouters.js'

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/authenticateUser.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) //`:method :url :status :response-time ms - :res[content-length]`
} //`NODE_ENV is often used to specify whether the application is running in a development, staging, or production environment`
//`By convention, the value of NODE_ENV is set to 'development' by default, but it can be set to other values depending on the environment`

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
// app.use('/api/job', jobRouters)
app.use('/api/job', authenticateUser, jobRouters) //`use middleware to add authentication which can let only authenticated user do sth(more complicated method: add middleware 'authenticateUser' to every route in 'jobRouters.js')`

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
